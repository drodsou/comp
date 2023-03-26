const toBase64 = btoa ? btoa : (txt)=>Buffer.from(txt).toString('base64'); 
const fromBase64 = atob ? atob : (b64)=>Buffer.from(b64, 'base64').toString('utf-8')

/**
 * once each tag
*/
export default function defineCE(importMetaUrl, tagDef) {
  tagDef.elCount = 0;
  tagDef.importMetaUrl = importMetaUrl;
  tagDef.tagName = importMetaUrl.split('/').pop().split('.').shift();
  tagDef.define = define;

  tagDef.html = tagDef.html || (()=>'');
  tagDef.style = tagDef.style || (()=>'');
  tagDef.render = render;
  tagDef.attr = tagDef.attr || []
  
  // tagDef.update
  // tagDef.props
  // tagDef.onMount
  // tagDef.do
  // tagDef.emitChange = true

  defineCE.defined.push(tagDef);

  const tagRender = function (...args) { return tagDef.render(...args);  }
  Object.assign(tagRender, tagDef);
  return tagRender;
  // return tagDef;
};

defineCE.defined = [];
defineCE.defineAll = function () {
  this.defined.forEach(def=>def.define());
};



/**
 * Callable from .define automatically on client, or directly on server for SSR
 * Once each instance
 */
function render(elOrAttr='', props={}, innerHTML='') {
  const tagDef = this;
  tagDef.elCount++;

  let el
  let attr
  if (typeof elOrAttr === 'string') attr = elOrAttr
  else el = elOrAttr;

  if (Array.isArray(innerHTML)) innerHTML = innerHTML.join('\n');

  // -- html()
  let html = tagDef.html({props, innerHTML});

  if (!el) {

    // -- ssr rendering, add stringified props for the client
    html = `
      <${tagDef.tagName} ${attr} data-props="${toBase64(JSON.stringify(props))}">
        ${html}
      </${tagDef.tagName}>
    `;
  }

  
  // --debug
  // if (el) console.log('client rendering', tagDef.tagName, ':', tagDef.elCount, '-',  el.id);

  // -- style() just in first instance, applies to all
  let style = '';
  if (tagDef.elCount === 1) {
    if (tagDef.style === true) {
      // -- link css. if in browser
      if (typeof window !== 'undefined') linkCss(tagDef.importMetaUrl);

    } else {
      // -- add style element
      style = tagDef.style(tagDef.tagName).trim();
      if (style.length>0 && !style.startsWith('<style')) {
        style = '<style>' + style + '</style>';
      }
    }
  }
  
  return html + style;
};



/**
 * once for each tag
*/
function define() {
  const tagDef = this;

  customElements.define(tagDef.tagName, class extends HTMLElement {

    constructor () {
      super();
      const elDom = this;
      const elPriv = this.elPriv = {
        props: Object.assign( {}, tagDef.props /* mountProps */),
        ready: false,
        update() {
          if (tagDef.update) tagDef.update({
            el: elDom,
            props: elPriv.props
          }); 
          // -- emitChange?
          if (tagDef.emitChange) {
            const propsStr = JSON.stringify(elPriv.props)
            if (propsStr !== elPriv.lastPropsStr) 
            elDom.dispatchEvent(new CustomEvent('change',{detail: {...elPriv.props}} ));  // works with onchange and Svelte on:change
            elPriv.lastPropsStr = propsStr;
          }
        },
        do : {},
      }
      Object.entries(tagDef.do).forEach(([key,fn])=>{
        elPriv.do[key] = fn.bind(elPriv);
      })

      elDom.do = elPriv.do;
    }
    
    set props(p) {
      const {elPriv} = this;
      Object.assign(elPriv.props,p);
      if (elPriv.ready) elPriv.update();
    }

    get props() {
      const {elPriv} = this;
      return {...elPriv.props}
    }

    /**
     * once for each elDom
    */
    connectedCallback() {
      const elDom = this;
      const {elPriv} = this;
      
      // -- this for Svelte compatibility, messes with innerHTML, removing it and appending it later
      // -- so we wait for "later" to get it
      // -- equivalent to precess.nextTick
      Promise.resolve().then(()=>{
        
        // -- no render if it was already SSR
        const dataProps = elDom.dataset.props;
        if (dataProps) {
          if (dataProps !== 'client-rendered')  { 
            // -- get stringified ssr props
            Object.assign(elPriv.props, JSON.parse(fromBase64(elDom.dataset.props)));
          } 
          // else  console.log('omiting client re-render'); 

        } else {
          // -- client render
          elDom.innerHTML = tagDef.render(elDom, elPriv.props, elDom.innerHTML);
          elDom.dataset.props = 'client-rendered';
          // elPriv.rendered = true;
        }
        // -- render debut
        if (tagDef.onMount) tagDef.onMount({el:elDom});

        elPriv.update();
        elPriv.ready = true;
      })

    }

    // -- intentionally dont use observed attributes, to avoid props/attr sync mess
    static get observedAttributes() { 
      return tagDef.attr; 
    }
    attributeChangedCallback(name, oldValue, newValue) {
      this.props = {[name] : newValue}
    }

  })
};



// window.defineCE = defineCE

// --helper, independent of 'comp'
export function linkCss(jsUrl) {
  const linkEl = document.createElement("link");
  linkEl.setAttribute("rel", "stylesheet");
  linkEl.setAttribute("href", jsUrl.replace('.js','.css'));
  document.head.append(linkEl);
}


// function uid (prefix='') {
//   let id = Math.floor(Math.random() * Date.now()).toString(32)
//   return prefix ? (prefix + '-' + id) : id;
// }
const toBase64 = btoa ? btoa : (txt)=>Buffer.from(txt).toString('base64'); 
const fromBase64 = atob ? atob : (b64)=>Buffer.from(b64, 'base64').toString('utf-8')

/**
 * once each tag
*/
export default function qomp(importMetaUrl, tagDef) {
  tagDef.elCount = 0;
  tagDef.importMetaUrl = importMetaUrl;
  tagDef.tagName = importMetaUrl.split('/').pop().split('.').shift();
  tagDef.define = define;

  tagDef.html = tagDef.html || (()=>'');
  tagDef.css = tagDef.css || (()=>'');
  tagDef.render = render;
  tagDef.style = style;
  tagDef.attr = tagDef.attr || []
  
  // tagDef.update
  // tagDef.props
  // tagDef.onMount
  // tagDef.do
  // tagDef.emitChange = true

  qomp.tags.push(tagDef);

  // -- syntax sugar for tagDef() === tagDef.render()
  const tagRender = function (...args) { return tagDef.render(...args);  }
  Object.assign(tagRender, tagDef);
  return tagRender;
  // return tagDef;
};

qomp.tags = [];

// -- client only
qomp.defineAll = function (withStyle = true) {
  if (withStyle) createStyle(qomp.styleAll());  
  
  this.tags.forEach(tagDef=>{
    tagDef.define(false);   // withStyle false, as we do all styles together afterwards
  });
};

// -- client or server
qomp.styleAll = function () {
  let styleAll = {link: [], css : ''};
  this.tags.forEach(tagDef=>{
    let style = tagDef.style();
    if (style.link.length) styleAll.link.push(style.link);
    if (style.css.length) styleAll.css += '\n' + style.css;
  });
  return styleAll;
}


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
  
  return html;
};

function style() {
  const tagDef = this;
  const st = { link : [],  css : '' } ;

  if (tagDef.css === true) {
    st.link = tagDef.importMetaUrl.replace('.js','.css');
  } else {
    st.css = tagDef.css(tagDef.tagName).trim();
  }
  return st;
}



/**
 * web component definition: render html + insert styles (client only 
 * OR just hydrate (events + state + update)
 * once for each tag, used in browser only
*/
function define(withStyle=true) {
  const tagDef = this;

  if (withStyle) createStyle(tagDef.style())

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
   
    // -- reactive .props
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
     * each instance in the html of each tagDef
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
          // -- ssr prerendered
          if (dataProps !== 'client-rendered')  { 
            // -- get stringified ssr props
            Object.assign(elPriv.props, JSON.parse(fromBase64(elDom.dataset.props)));
          } 
          // else  console.log('omiting client re-render'); 

        } else {
          // -- client render
          elDom.innerHTML = tagDef.render(elDom, elPriv.props, elDom.innerHTML);
          // -- if defineAll well do this later all at once
          elDom.dataset.props = 'client-rendered';
        }
        // -- render 
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


 // -- HELPERS

 function createStyle(st) {
    if (typeof window !== 'undefined') {
      if (st.css.length >0) addStyleElement(st.css);
      if (st.link.length > 0) {
        let links = typeof st.link  === 'string' ? [st.link] : st.link;
        links.forEach(link=>addCssLink(link));
      }
    }
 }

function addCssLink(cssUrl) {
  const linkEl = document.createElement("link");
  linkEl.setAttribute("rel", "stylesheet");
  linkEl.setAttribute("href", cssUrl);
  document.head.append(linkEl);
}


function addStyleElement(css) {
  const styleEl = document.createElement("style");
  styleEl.setAttribute("type", "text/css");
  styleEl.append(document.createTextNode(css));
  document.head.append(styleEl);
}


// window.qomp = qomp

// // --helper, independent of 'comp'
// export function linkCss(jsUrl) {
//   const linkEl = document.createElement("link");
//   linkEl.setAttribute("rel", "stylesheet");
//   linkEl.setAttribute("href", jsUrl.replace('.js','.css'));
//   document.head.append(linkEl);
// }


// function uid (prefix='') {
//   let id = Math.floor(Math.random() * Date.now()).toString(32)
//   return prefix ? (prefix + '-' + id) : id;
// }
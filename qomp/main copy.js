// -- HELPERS

const toBase64 = btoa ? btoa : (txt)=>Buffer.from(txt).toString('base64'); 
const fromBase64 = atob ? atob : (b64)=>Buffer.from(b64, 'base64').toString('utf-8')
const nextTick = (fn) => Promise.resolve().then(fn);
const toHead = (t,attr,ch) => {
  const e = document.createElement(t);
  Object.entries(attr).forEach(([k,v])=>e.setAttribute(k,v));
  if (ch) e.append(document.createTextNode(ch));
  document.head.append(e);
}
const createStyle = ({link,css}) => {
  if (css.length >0) toHead('style', {type:'text/css'}, css);
  if (link.length > 0) {
    let links = typeof link  === 'string' ? [link] : link;
    links.forEach(l=>toHead('link', {rel:'stylesheet', href: l}));
  }
}
const CLIENT_RENDERED = 'client-rendered';
DEBUG && console.log('marcelino');



// ----------- QOMP, MAIN FUNCTION

/**
 * main creation function
 * once per tag
 * client or server
*/
export default function qomp(importMetaUrl, tagDef) {
  tagDef = Object.assign({
    elCount: 0, 
    importMetaUrl, 
    tagName: importMetaUrl.split('/').pop().split('.').shift(),
    props: {},
    attr : [],
    css : ()=>'',
    html : ()=>'',
    update: ()=>{},
    events: ()=>[],
    do : {},
    style, render, define
  }, tagDef);

  // TODO: willUpdate, didUpdate, willMount, didMount, willUnmount, didUnmount

  qomp.tags.push(tagDef);
  
  // -- syntax sugar for tagDef() === tagDef.render()
  // return tagDef;
  const tagRender = function (...args) { return tagDef.render(...args);  }
  Object.assign(tagRender, tagDef);
  return tagRender;
};

qomp.tags = [];

/**
 * once for all tags, client or server
 */
qomp.styleAll = function () {
  let styleAll = {link: [], css : ''};
  this.tags.forEach(tagDef=>{
    let style = tagDef.style();
    if (style.link) styleAll.link.push(style.link);
    if (style.css) styleAll.css += '\n' + style.css;
  });
  return styleAll;
}

// -- once for all tags
qomp.defineAll = function (withStyle = true) {
  if (withStyle) createStyle(qomp.styleAll());  
  
  this.tags.forEach(tagDef=>{
    tagDef.define(false);   // withStyle false, as we do all styles together afterwards
  });
};


// -- TAGDEF FUNCTIONS: style, render, define


/**
 * once per tag, 
 * client or server
 * wrapper of .css()
*/
function style() {
  const tagDef = this;
  const st = {} ;   // {link, css}

  if (tagDef.css === true) {
    st.link = tagDef.importMetaUrl.replace('.js','.css');
  } else {
    st.css = tagDef.css(tagDef.tagName).trim();
  }
  return st;
}


/**
 * Once per instance (executed), once per tag (defined)
 * client or server
 * wrapper of .html()
 * Callable from .define automatically on client, or directly on server for SSR
 * @param elOrAttr - client:dom elemnt, server string with attributes of the would be element
 */
function render(elOrAttr='', props={}, slot='') {
  const tagDef = this;
  tagDef.elCount++;   // here bc it's alweays called, server or client

  let el
  let attr
  if (typeof elOrAttr === 'string') attr = elOrAttr
  else el = elOrAttr;

  if (Array.isArray(slot)) slot = slot.join('\n');

  let html = tagDef.html({props, slot});
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


/**
 * web component definition: render html (+ insert styles) OR just hydrate (events + state + update)
 * once per instance (inside), once per tag (outside), 
 * client only
 */ 
function define(withStyle=true) {
  // -- ouside, each tag
  const tagDef = this;

  if (withStyle) createStyle(tagDef.style())

  // -- inside, EACH INSTANCE

  customElements.define(tagDef.tagName, class extends HTMLElement {

    constructor () {
      super();
      const elDom = this;
      const elPriv = this.elPriv = {
        props: Object.assign( {}, tagDef.props /* mountProps */),
        ready: false,
        // -- instance update, wrapper of tag .update()
        // update() {
        //   const propsStr = JSON.stringify(elPriv.props)
        //   if (propsStr !== elPriv.lastPropsStr) {
        //     // -- change
        //     elPriv.lastPropsStr = propsStr;
        //     tagDef.update({el:elDom, props:elPriv.props,
        //       set:(qs,val)=>elDom.querySelector(qs).innerHTML = val
        //      }); 
        //     elDom.dispatchEvent(new CustomEvent('change',{detail: {...elPriv.props}} ));  // works with onchange and Svelte on:change
        //   }
        // },
        update() {
          tagDef.update({el:elDom, props:elPriv.props,
            set:(qs,val)=>elDom.querySelector(qs).innerHTML = val
          }); 
          elDom.dispatchEvent(new CustomEvent('change',{detail: {...elPriv.props}} ));  // works with onchange and Svelte on:change
        },
        do : {},
        elEvents : []
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
      
      // -- this for Svelte compatibility that messes with innerHTML, removing it and appending it later
      // -- so we wait for "later" to get it
      
      nextTick(()=>{
        // -- no render if it was already SSR
        const dataProps = elDom.dataset.props;
        if (dataProps) {
          // -- ssr prerendered
          if (dataProps !== CLIENT_RENDERED)  { 
            // -- get stringified ssr props
            Object.assign(elPriv.props, JSON.parse(fromBase64(elDom.dataset.props)));
          } 
          // else  console.log('omiting client re-render'); 

        } else {
          // -- client render
          elDom.innerHTML = tagDef.render(elDom, elPriv.props, elDom.innerHTML);
          elDom.dataset.props = CLIENT_RENDERED;
        }
        // -- events
        nextTick(()=>{
          // check if render() persisted, or already not in DOM (nested child already rerender, skip)
          if (!elDom.parentElement) return;  

          elPriv.elEvents = tagDef.events({el:elDom}).map( ([qs,ev,fn])=>({qs,ev,fn}) );
          elPriv.elEvents.forEach(e=>{
            elDom.querySelector(e.qs).addEventListener(e.ev, e.fn);
          })
        });

        // -- first auto update ??  (html() should have best practices of fiilling props, even thou is redundant with update
        // elPriv.update();

        elPriv.ready = true;
      })
    }

    // -- onDismount: autoremove event listener (if evt is used)
    disconnectedCallback() {
      const elDom = this;
      const {elPriv} = this;

      elPriv.elEvents.forEach(e=> elDom.querySelector(e.qs).removeEventListener(e.ev, e.fn));
      elPriv.elEvents=[]
    }

    // -- attributes => props
    static get observedAttributes() { 
      return tagDef.attr; 
    }
    attributeChangedCallback(name, oldValue, newValue) {
      this.props = {[name] : newValue}
    }

  })
};




 // -- CLIENT STYLE HELPERS

//  function createStyle(st) {
//     if (st.css.length >0) addStyleElement(st.css);
//     if (st.link.length > 0) {
//       let links = typeof st.link  === 'string' ? [st.link] : st.link;
//       links.forEach(link=>addCssLink(link));
//     }
//  }

// function addCssLink(cssUrl) {
//   const linkEl = document.createElement("link");
//   linkEl.setAttribute("rel", "stylesheet");
//   linkEl.setAttribute("href", cssUrl);
//   document.head.append(linkEl);
// }

// function addStyleElement(css) {
//   const styleEl = document.createElement("style");
//   styleEl.setAttribute("type", "text/css");
//   styleEl.append(document.createTextNode(css));
//   document.head.append(styleEl);
// }





// function uid (prefix='') {
//   let id = Math.floor(Math.random() * Date.now()).toString(32)
//   return prefix ? (prefix + '-' + id) : id;
// }
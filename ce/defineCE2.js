const SSR_PROPS_INI = '<ce_ssr_props style="display:none;">';
const SSR_PROPS_END = '</ce_ssr_props>';


/**
 * 
*/
export function defineCE(importMetaUrl, tagDef) {
  tagDef.elCount = 0;
  tagDef.tagName = importMetaUrl.split('/').pop().split('.').shift();
  tagDef.define = define;

  tagDef.html = tagDef.html || (()=>'');
  tagDef.style = tagDef.style || (()=>'');
  tagDef.render = render;
  
  // tagDef.update
  // tagDef.props
  // tagDef.onMount
  // tagDef.do

  return tagDef;
};


/**
 * Callable from .define automatically on client, or directly on server for SSR
 */
function render({props, innerHTML, ssr=true}) {
  const tagDef = this;
  tagDef.elCount++;
  console.log(tagDef.elCount)

  // -- html()
  let html = tagDef.html({props, innerHTML});
  // html = tagDef.elCount + '|' + html;
  if (ssr) {
    html = SSR_PROPS_INI + JSON.stringify(props) + SSR_PROPS_END  + html
  }

  // -- style() just in first instance, applies to all
  let style = '';
  if (tagDef.elCount === 1) {
    style = tagDef.style(tagDef.tagName).trim();
    if (style.length>0 && !style.startsWith('<style')) {
      style = '<style>' + style + '</style>';
    }
  }
  
  return html + style;
};



/**
 * once for each tag
*/
function define(justHydrate=false) {
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
        // console.log('cc:', elDom.outerHTML );
        
        // -- no render if it was already SSR
        if (justHydrate) {
          // -- ger ssr props
          let m = elDom.innerHTML.match(new RegExp(SSR_PROPS_INI + '(.*?)' + SSR_PROPS_END))
          if (m) Object.assign(elPriv.props, JSON.parse(m[1]));
        } else {
          // -- render
          elDom.innerHTML = tagDef.render({props:elPriv.props, innerHTML:elDom.innerHTML, ssr:false});
        }
        if (tagDef.onMount) tagDef.onMount({el:elDom});
        elPriv.update();
        elPriv.ready = true;
      })

    }

    // -- intentionally dont use observed attributes, to avoid props/attr sync mess
  })
};

// defineCE.defined = {};

// window.defineCE = defineCE


// function uid (prefix='') {
//   let id = Math.floor(Math.random() * Date.now()).toString(32)
//   return prefix ? (prefix + '-' + id) : id;
// }
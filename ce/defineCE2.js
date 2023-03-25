/**
 * 
*/
export function defineCE(importMetaUrl, tagDef) {
  tagDef.tagName = importMetaUrl.split('/').pop().split('.').shift();
  tagDef.mountAll = mountAll;
  // tagDef.render
  // tagDef.update
  // tagDef.props
  // tagDef.onMount
  // tagDef.do

  return tagDef;
};

/**
 * once for each tag
*/
function mountAll(mountProps) {
  const justHydrate = !!mountProps;
  const tagDef = this;
 

  customElements.define(tagDef.tagName, class extends HTMLElement {

    constructor () {
      super();
      const elDom = this;
      const elPriv = this.elPriv = {
        props: Object.assign( {}, tagDef.props, mountProps),
        ready: false,
        update() {
          if (tagDef.update) tagDef.update({
            el: elDom,
            props: elPriv.props
          }); 
        },
        do : {}
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
        if (tagDef.render && !justHydrate) elDom.innerHTML = tagDef.render({
          props: elPriv.props,
          innerHTML : elDom.innerHTML
        });
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
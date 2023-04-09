import objPath from './objPath.js';
import attr2arr from './attr2arr.js';
import qsa from './qs.js';

const CTX_KEY  = '_storeContext_XURH1';
/*
TODO: nested element with different store
*/


export default function storeContext (stores) {
  Object.entries(stores).forEach(([stName,st])=>{
    createContextElement(stName, st);
  });
}


function createContextElement(stName,st) {

  customElements.define('ctx-' + stName, class extends HTMLElement {
    constructor() {
      super();
      const ctx = this;
      ctx[CTX_KEY] = true;
      ctx.attachShadow({ mode: 'open' });
      ctx.shadowRoot.innerHTML = `<slot></slot>`;

      // -- events
      ctx.querySelectorAll(`[stEv]`).forEach(child=>{
        if (parentContext(child) !== ctx) return;
        attr2arr(child.getAttribute('stEv')).forEach(evArr=>{
          const [fnPath, ev='click'] = evArr;
          const fn = objPath(st, fnPath).get();
          el.addEventListener(ev,fn);
        });
      });

        // -- updates_ ex stUp="calc.countHtml|innerHTML"  (innerHTML is default, optional)
      st.subscribe(s=>{
        ctx.querySelectorAll(`[stUp]`).forEach(el=>{
          if (parentContext(child) !== ctx) return;
          attr2arr(el.getAttribute('stUp')).forEach(upArr=>{
            const [valuePath, targetPath='innerHTML'] = upArr;
            let value = objPath(s, valuePath).get();
            if (typeof value === 'function') value = value.apply(el);
            objPath(el,targetPath).set(value);
          });
        });
      });


    }
  });

}


function parentContext (el) {
  if (el === document) return undefined;
  if (el[CTX_KEY]) return el
  return parentContext(el.parentNode)
}

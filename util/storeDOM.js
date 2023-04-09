/*
  creates stores dom contexts, associates stores with dom nodes, and converts stEv and stUp attributes to eddEventListener and subscriptions
  allows nested contexts without messing things
*/


import objPath from './objPath.js';
import attr2arr from './attr2arr.js';

const CTX_KEY  = '_storeDOM_AN52F';
const DEBUG = true;
const ATTR_EVT = 'evt'
const ATTR_SUB = 'sub'

// export default function storeDOM (...stQsPairs) {

//   // -- mark all context roots first, so its clear which element belongs to each context when they are nested
//   stQsPairs.forEach(([st,qs])=>markAsContextRoot(st,qs));
//   stQsPairs.forEach(([st,qs])=>connectStoreDOM(st,qs));
// }

export default function storeDOM (storesObj, classPrefix = '') {
  const stores = Object.entries(storesObj).map(([stName,st])=>({st, qs: '.'+classPrefix+stName, stName}));
  console.log(stores);
  // -- mark all context roots first, so its clear which element belongs to each context when they are nested
  stores.forEach(({st,qs})=>markAsContextRoot(st,qs));
  stores.forEach(({st,qs})=>connectStoreDOM(st,qs));
}

function markAsContextRoot (st,qs) {
  let ctxRoot = [...document.querySelectorAll(qs)]
  if (ctxRoot.length === 0) throw new Error(`storeDOM: no element found in DOM for context root querySelector "${qs}"`);
  if (ctxRoot.length > 1) throw new Error(`storeDOM: more than on element found in DOM for context root querySelector "${qs}"`);
  ctxRoot = ctxRoot[0];

  ctxRoot[CTX_KEY] = st;
}

function parentContext (el) {
  if (el === document) return {};
  if (el[CTX_KEY]) return {node:el, store:el[CTX_KEY]}
  return parentContext(el.parentNode)
}

/**
 * attach events and subscriptions for one context
*/
function connectStoreDOM (st, qs='') {
  DEBUG && console.log('\n---', qs)
  let qsEl = document.querySelector(qs);

  // -- updates_ ex stUp="calc.countHtml|innerHTML"  (innerHTML is default, optional)
  document.querySelectorAll('['+ATTR_SUB+']').forEach(el=>{
    if (parentContext(el).node !== qsEl) return;
    attr2arr(el.getAttribute(ATTR_SUB)).forEach(upArr=>{
      const [valuePath, targetPath='innerHTML'] = upArr;
      st.subscribe(s=>{
        let value = objPath(s, valuePath).get();
        if (typeof value === 'function') value = value.apply(el);
        objPath(el,targetPath).set(value);
      })
      DEBUG && console.log('sub:', el.tagName, el.id, '.', targetPath, valuePath);
    });
  });

  // -- events ex stEv="calc.countHtml|innerHTML"  (innerHTML is default, optional)
  document.querySelectorAll('['+ATTR_EVT+']').forEach(el=>{
    if (parentContext(el).node !== qsEl) return;
    attr2arr(el.getAttribute(ATTR_EVT)).forEach(evArr=>{
      const [fnPath, ev='click'] = evArr;
      const fn = objPath(st, fnPath).get();
      el.addEventListener(ev,fn);
      DEBUG && console.log('evt:', el.tagName, el.id, '.', ev, fnPath);
    });
  });



}
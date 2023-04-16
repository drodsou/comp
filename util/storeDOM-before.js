/*
  creates stores dom contexts, associates stores with dom nodes, and converts stEv and stUp attributes to eddEventListener and subscriptions
  allows nested contexts without messing things

  before: made 1 subscripton to store for each SUB in an element. Problem: not able to track deleted elementns
  now: just 1 subscription for storeDOM, which keeps a Map of nodes (els), checking if they are still in the
  DOM on each update.

  TODO: option to subscribe to the stores and recheck EVT, SUB on each store change
*/

import objPath from './objPath.js';
import attr2arr from './attr2arr.js';
import nextTick from './nextTick.js';
import createStyle from './createStyle.js';

const ATTR_EVT = 'do'
const ATTR_SUB = 'show'
const DEBUG = true;

const specialTarget = {
  $visible (value, arg) {
    const el = this;
    el.classList[ value === arg ? 'remove' : 'add']('storeDOM-hidden')
  },
  $hidden (value, arg) {
    const el = this;
    el.classList[ value === arg ? 'add' : 'remove']('storeDOM-hidden')
  },
  $removeClass (value, tValue,tClass) {
    const el = this;
    el.classList[ value === tValue ? 'remove' : 'add'](tClass)
  },
  $addClass (value, tValue,tClass ) {
    const el = this;
    el.classList[ value === tValue ? 'add' : 'remove'](tClass)
  },
}

/**
 * repeatOnChage: rechecks binding after each store change (if stores create and destroy elements (not optimal)
*/
export default function storeDOM (stores) {

  createStyle({css:/*css*/`
    .storeDOM-hidden {
      display: none;
    }
  `});

  const els = new Map();

  function storeDOMUpdate() {

    DEBUG && console.log('\nstoreDOM:update');
    
    // -- clean deleted elements, and set existing to pending update
    for (let [el] of els) {
      DEBUG && console.log('storeDOM:pending update', el.tagName, el.id);
      els.set(el,'pend');
    }
    
    // DEBUG && console.log('\n---storeDOM:', el.tagName, el.id);

    let pending = true;

    while (pending) {
      DEBUG && console.log('storeDOM:scan new elements');
      // -- scan new elements, mark as pending update, addEventlisteners
      document.body.querySelectorAll('['+ATTR_SUB+'],['+ATTR_EVT+']').forEach(el=>{
        if (els.get(el)) {
          DEBUG && console.log('storeDOM: not adding element:', el.tagName, el.id);
          return;
        } 
        DEBUG && console.log('storeDOM: adding element', el.tagName, el.id);
        els.set(el,'pend');

        // -- events
        let attr_evt = el.getAttribute(ATTR_EVT);
        attr2arr(attr_evt).forEach(evArr=>{
          const [fnPath, ev='click'] = evArr;
          const [stKey, ...stPath] = fnPath.split('.');
          let fn = objPath(stores[stKey].do, stPath).get();
          DEBUG && console.log('storeDOM:', ATTR_EVT, '(addEvt)  :',  fnPath, ' <== ', ev, el.tagName, el.id);
          el.addEventListener(ev,(...args)=>{
            DEBUG && console.log('storeDOM:',ATTR_EVT, '(do) :', fnPath, ' <== ', ev, el.tagName, el.id);
            fn.apply(el, args);
          });
        });
      });

      // -- updates: update all pending
      pending = false;
      for (let [el, elFlag] of els) {
        if (!el.parentNode) {
          DEBUG && console.log('storeDOM:delete node', el.tagName, el.id);
          els.delete(el) 
          continue;
        } 
        if (elFlag === 'done') {
          DEBUG && console.log('storeDOM: not updating', el.tagName, el.id);
          continue;
        }

        els.set(el,'done');
        let attr_sub = el.getAttribute(ATTR_SUB);
        attr2arr(attr_sub).forEach(upArr=>{
          const [valuePath, targetPath='innerHTML', ...args] = upArr;
          const [stKey, ...stPath] = valuePath.split('.');
          const s = stores[stKey]
          let value = objPath({...s.data, ...s.calc}, stPath).get();
          if (typeof value === 'function') value = value.apply(el,args);
          DEBUG && console.log('storeDOM', ATTR_SUB, '(updating) ', el.tagName, el.id, ':', value, ' ==> ', targetPath);
          if (targetPath in specialTarget) {
            specialTarget[targetPath].apply(el,[value, ...args]);
          } else if (value !== undefined) {
            objPath(el,targetPath).set(value);
            if (value.includes && (value.includes(' '+ATTR_SUB+'="') || value.includes(' '+ATTR_EVT+'="'))  )  {
              pending = true;
              DEBUG && console.log('storeDOM: dynamic element has bindings, mark for rescan');
            }
          }
        });
      }

    } // -- while pending
  }

  Object.values(stores).forEach(st=>st.subscribe(storeDOMUpdate));

}


/*
  creates stores dom contexts, associates stores with dom nodes, and converts stEv and stUp attributes to eddEventListener and subscriptions
  allows nested contexts without messing things

  TODO: option to subscribe to the stores and recheck EVT, SUB on each store change
*/

import objPath from './objPath.js';
import attr2arr from './attr2arr.js';
import nextTick from './nextTick.js';

const ATTR_EVT = 'do'
const ATTR_SUB = 'show'
const PROP_DONE = '_storeDOM_h3if7'  // necessary in casoe of recheckOnChange option (dynamic elements with show/do)
const DEBUG = true;

/**
 * repeatOnChage: rechecks binding after each store change (if stores create and destroy elements (not optimal)
*/
export default function storeDOM (stores, recheckOnChange=false) {

  function bind() {
    DEBUG && console.log('\nstoreDOM:bind');
    // -- updates_ ex stUp="calc.countHtml|innerHTML"  (innerHTML is default, optional)

    document.body.querySelectorAll('['+ATTR_SUB+'],['+ATTR_EVT+']').forEach(el=>{
      if (el[PROP_DONE]) {
        DEBUG && console.log('\nstoreDOM:skipping bind:', el.tagName, el.id);
        return;
      }
      el[PROP_DONE] = true;
      
      let attr_sub = el.getAttribute(ATTR_SUB);
      let attr_evt = el.getAttribute(ATTR_EVT);
      if (!attr_sub && !attr_evt) return;
      

      DEBUG && console.log('\n---storeDOM:', el.tagName, el.id);

      attr2arr(attr_sub).forEach(upArr=>{
        const [valuePath, targetPath='innerHTML'] = upArr;
        const [stKey, ...stPath] = valuePath.split('.');
        DEBUG && console.log('storeDOM', ATTR_SUB, '(subscribe) :', valuePath, ' ==> ', targetPath);
        stores[stKey].subscribe(s=>{
          let value = objPath({...s.data, ...s.calc}, stPath).get();
          if (typeof value === 'function') value = value.apply(el);
          DEBUG && console.log('storeDOM', ATTR_SUB, '(updating) :', value, ' ==> ', targetPath);
          objPath(el,targetPath).set(value);
          if (recheckOnChange && value.includes && value.includes(' '+ATTR_SUB+'="')) {
            DEBUG && console.log('storeDOM', ATTR_SUB, '(value inludes',ATTR_SUB,', re-bind) :', value, ' ==> ', targetPath);
            nextTick(bind);
          }
        }, true)  
      });

      attr2arr(attr_evt).forEach(evArr=>{
        const [fnPath, ev='click'] = evArr;
        const [stKey, ...stPath] = fnPath.split('.');
        let fn = objPath(stores[stKey].do, stPath).get();
        DEBUG && console.log('storeDOM:', ATTR_EVT, '(addEvt)  :',  fnPath, ' <== ', ev);
        el.addEventListener(ev,(...args)=>{
          DEBUG && console.log('storeDOM:',ATTR_EVT, '(do) :', fnPath, ' <== ', ev);
          fn.apply(el, args);
        });
      });
    });

  } // -- bind

  bind();
}
/*
  creates stores dom contexts, associates stores with dom nodes, and converts stEv and stUp attributes to eddEventListener and subscriptions
  allows nested contexts without messing things

  TODO: option to subscribe to the stores and recheck EVT, SUB on each store change
*/

import objPath from './objPath.js';
import attr2arr from './attr2arr.js';

const ATTR_EVT = 'do'
const ATTR_SUB = 'show'
const PROP_DONE = '_storeDOM_h3if7'
const DEBUG = false;

/**
 * repeatOnChage: rechecks binding after each store change (if stores create and destroy elements (not optimal)
*/
export default function storeDOM (stores, recheckOnChange=false) {

  function check() {
    console.log('storeDOM:check');
    // -- updates_ ex stUp="calc.countHtml|innerHTML"  (innerHTML is default, optional)
    document.body.querySelectorAll('*').forEach(el=>{
      if (el[PROP_DONE]) return;
      el[PROP_DONE] = true;
      
      let attr_sub = el.getAttribute(ATTR_SUB);
      let attr_evt = el.getAttribute(ATTR_EVT);
      if (!attr_sub && !attr_evt) return;

      DEBUG && console.log('\n---', el.tagName, el.id);

      attr2arr(attr_sub).forEach(upArr=>{
        const [valuePath, targetPath='innerHTML'] = upArr;
        const [stKey, ...stPath] = valuePath.split('.');
        stores[stKey].subscribe(s=>{
          let value = objPath({...s.data, ...s.calc}, stPath).get();
          if (typeof value === 'function') value = value.apply(el);
          objPath(el,targetPath).set(value);
        })
        DEBUG && console.log(ATTR_SUB, ':', valuePath, ' ==> ', targetPath);
      });

      attr2arr(attr_evt).forEach(evArr=>{
        const [fnPath, ev='click'] = evArr;
        const [stKey, ...stPath] = fnPath.split('.');
        const fn = objPath(stores[stKey].do, stPath).get();
        el.addEventListener(ev,fn);
        DEBUG && console.log(ATTR_EVT, '  :',  fnPath, ' <== ', ev);
      });
    });
  }

  check();
  if (recheckOnChange) { Object.values(stores).forEach(s=>s.subscribe(check, false));  }

}
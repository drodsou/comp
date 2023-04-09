/*
  creates stores dom contexts, associates stores with dom nodes, and converts stEv and stUp attributes to eddEventListener and subscriptions
  allows nested contexts without messing things
*/

import objPath from './objPath.js';
import attr2arr from './attr2arr.js';

const ATTR_EVT = 'do'
const ATTR_SUB = 'show'

const DEBUG = false;


export default function storeDOM (stores) {

  // -- updates_ ex stUp="calc.countHtml|innerHTML"  (innerHTML is default, optional)
  document.body.querySelectorAll('*').forEach(el=>{
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
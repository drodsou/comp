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


export default function storeDOM (stores) {

  // -- updates_ ex stUp="calc.countHtml|innerHTML"  (innerHTML is default, optional)
  document.querySelectorAll('['+ATTR_SUB+']').forEach(el=>{
    attr2arr(el.getAttribute(ATTR_SUB)).forEach(upArr=>{
      const [valuePath, targetPath='innerHTML'] = upArr;
      const [stKey, ...stPath] = valuePath.split('.');
      stores[stKey].subscribe(s=>{
        let value = objPath(s, stPath).get();
        if (typeof value === 'function') value = value.apply(el);
        objPath(el,targetPath).set(value);
      })
      DEBUG && console.log('sub:', el.tagName, el.id, '.', targetPath, valuePath);
    });
  });

  // -- events ex stEv="calc.countHtml|innerHTML"  (innerHTML is default, optional)
  document.querySelectorAll('['+ATTR_EVT+']').forEach(el=>{
    attr2arr(el.getAttribute(ATTR_EVT)).forEach(evArr=>{
      const [fnPath, ev='click'] = evArr;
      const fn = objPath(stores, fnPath).get();
      el.addEventListener(ev,fn);
      DEBUG && console.log('evt:', el.tagName, el.id, '.', ev, fnPath);
    });
  });

}
import objPath from './objPath.js';
import attr2arr from './attr2arr.js';
import qsa from './qs.js';

/*
TODO: nested element with different store
*/


export default function storeDOM (...stQsPairs) {
  stQsPairs.forEach(([st,qs])=>connectStoreDOM(st,qs));
}

function connectStoreDOM (st, qs='') {

  // -- events: ex stEv="do.inc|click"  (click is default, optional)
  document.querySelectorAll(`${qs} [stEv], ${qs}[stEv]`).forEach(el=>{
    attr2arr(el.getAttribute('stEv')).forEach(evArr=>{
      const [fnPath, ev='click'] = evArr;
      const fn = objPath(st, fnPath).get();
      el.addEventListener(ev,fn);
    });
  });

  // -- updates_ ex stUp="calc.countHtml|innerHTML"  (innerHTML is default, optional)
  st.subscribe(s=>{
    document.querySelectorAll(`${qs} [stUp], ${qs}[stUp]`).forEach(el=>{
      attr2arr(el.getAttribute('stUp')).forEach(upArr=>{
        const [valuePath, targetPath='innerHTML'] = upArr;
        let value = objPath(s, valuePath).get();
        if (typeof value === 'function') value = value.apply(el);
        objPath(el,targetPath).set(value);
      });
    });
  });

}
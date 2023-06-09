/**
* Minimal vanilla javascript store with Svelte store, and usable in any other framework)
* reactive .data prop, runs subscriptions on set

TODO use util/objAssignDeep on update

*/
export default function create (storeFn=()=>{}) {
  
  function _create (newData) {
    
    const priv = {
      dataObj : {},
      dataStrBefore : '',
      subs : new Set()
    }

    const store = {
      // -- basic
      _ : priv,
      get data() { return JSON.parse(JSON.stringify(priv.dataObj)) },
      set data(d) { store.update(d) },
      update (d={}) {
        console.log('store:update')
        Object.assign(priv.dataObj, d) 
        let dataStrNow = JSON.stringify(priv.dataObj);
        if (dataStrNow === priv.dataStrBefore) return;
        priv.dataStrBefore = dataStrNow;
        priv.subs.forEach(sub=>sub(store))
      },
      // svelte compatible for state AND computed, without need for derived stores (!)
      subscribe(fn, runOnSubscribe=true) {
        priv.subs.add(fn);
        if (runOnSubscribe) { fn(store) } // svelte expects fn to run on subscription by default, to get store value (!)
        return ()=>priv.subs.delete(fn); // unsubscribe
      },

      // -- extra. chainable
      reset (d={}) {
        priv.dataObj = JSON.parse(JSON.stringify(d));
        store.update();
        return store;
      },
      save (lsKey) {
        localStorage.setItem(lsKey, JSON.stringify(priv.dataObj));
        return store;
      },
      load (lsKey) {
        store.reset(JSON.parse(localStorage.getItem(lsKey)));
        return store;
      },
      listen(stArr, actionKey) {
        stArr.forEach(st=>st.subscribe(store.do[actionKey]));
        return store;
      }

    }

    let storeFnObj = storeFn(store);  // data, do, computed 
    priv.dataObj = JSON.parse(JSON.stringify(newData ? newData : (storeFnObj.data || {}) ))
    store.calc = storeFnObj.calc;
    store.do = storeFnObj.do;

    return store;
  }

  let newStore = _create()
  newStore.clone = _create;

  return newStore;
}










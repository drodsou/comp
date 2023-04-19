/**
* Minimal vanilla javascript store with Svelte store, and usable in any other framework)
* reactive .data prop, runs subscriptions on set

store.data plain object instead of getter,setter, as it forces to use deepMerge in objects
and .update is more verbose:  "d = st.data; d.one.two++; update(d)" OR "update(d=>({one:{two:d.one.two+1}}))"
this way: st.data.one.two++; st.update(); , no need for deep merges: leave this for  immutable more comple version of the store (Really needed or just immu-hype?)
*/
const DEBUG = false;

export default function create (storeFn=()=>{}) {
  
  function _create (newData) {
    
    const priv = {
      dataStrBefore : '',
      subs : new Set()
    }

    const store = {
      // -- basic
      _ : priv,
      data:{},
      update (dPath,dNew) {
        DEBUG && console.log('store:update', store.data.id, dPath, dNew)
        
        // -- optional (path, obj), partial semideep update
        if (dPath!==undefined || dNew !== undefined) try {
          DEBUG && console.log('store:updating', store.data.id, dPath, dNew)
          if (!dNew) { dNew = dPath; dPath = ''; }
          let d = !dPath ? store.data : dPath.split('.').reduce((p,c)=>p[c],store.data);
          Object.assign(d, dNew);
          DEBUG && console.log('store:updated', store.data.id, store.data)
        } catch (e) {
          DEBUG && console.log('store:error updating', store.data.id)
          throw new Error(`store: problem finding path '${dPath}' in store {${Object.keys(store.data).join()}...}`); 
        }

        let dataStrNow = JSON.stringify(store.data);
        if (dataStrNow === priv.dataStrBefore) return;
        priv.dataStrBefore = dataStrNow;
        DEBUG && console.log('store:runSub all', priv.subs.size);
        priv.subs.forEach(sub=>{
          sub(store);
        })
        
      },
      // svelte compatible for state AND computed, without need for derived stores (!)
      subscribe(sub, runOnSubscribe=true) {
        priv.subs.add(sub);
        if (runOnSubscribe) { 
          DEBUG && console.log('store:runSub one (auto)')
          sub(store) 
        } // svelte expects fn to run on subscription by default, to get store value (!)
        return ()=>priv.subs.delete(fn); // unsubscribe
      },

      // -- extra. chainable
      save (lsKey) {
        localStorage.setItem(lsKey, JSON.stringify(store.data));
        return store;
      },
      load (lsKey) {
        store.data = JSON.parse(localStorage.getItem(lsKey));
        return store;
      },
      listen(stArr, actionKey) {
        stArr.forEach(st=>st.subscribe(store.do[actionKey]));
        return store;
      }

    }

    let storeFnObj = storeFn(store);  // data, do, computed 
    store.data = JSON.parse(JSON.stringify(newData ? newData : (storeFnObj.data || {}) ))
    store.calc = storeFnObj.calc;
    store.do = storeFnObj.do;

    return store;
  }

  let newStore = _create()  // uses data from storeFn
  newStore.clone = _create;

  return newStore;
}










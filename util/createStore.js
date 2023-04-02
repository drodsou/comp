/**
* Minimal vanilla javascript store with Svelte store, and usable in any other framework)
* reactive .data prop, runs subscriptions on set
*/
export default function createStore(dataObj={}) {

  // -- subscriptions
  const subs = new Set();
  const runSubs = () => subs.forEach(sub=>sub(store))
  let dataStrBefore = '';

  const store = {
    _ : { subs, runSubs, dataObj },
    get data() { return {...dataObj} },
    set data(d) { 
      Object.assign(dataObj, d) 

      let dataStrNow = JSON.stringify(dataObj);
      if (dataStrNow === dataStrBefore) return;

      dataStrBefore = dataStrNow;
      runSubs();
    },

    // svelte compatible for state AND computed, without need for derived stores (!)
    subscribe(fn, runOnSubscribe=true) {
      subs.add(fn);
      if (runOnSubscribe) { fn(store) } // svelte expects fn to run on subscription by default, to get store value (!)
      return ()=>subs.delete(fn); // unsubscribe
    }
  }

  return store;
}
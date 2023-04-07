import createStore from '/util/createStore.js';
import qs from '/util/qs.js';

import '/qp/qp-spin.js';
import '/qp/qp-state-one.js';
import qomp from '/qomp/qomp.js';

let qpUno = qomp('qp-uno', {
  html :()=>`<div>uno:<slot></slot></div>`
});
qomp.defineAll();


// const context = {
//   store : createStore({count:11}),
//   action: {
//     inc(v) { context.store.data = {count: context.store.data.count+parseInt(v)} },
//     dec(v) { context.store.update(d=>({count:d.count-parseInt(v)})) }
//     // dec(v) { context.store._.dataObj.count++; context.store.update(),
//   },
//   computed: {
//     get spanColor() {
//       return context.store.data.count % 2 ? 'red' : 'teal'
//     }
//   }
// };
// context.store.subscribe(st=>console.log(st.data));
// qomp.defineAll({context});


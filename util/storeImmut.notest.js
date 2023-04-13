import test from 'node:test';
import assert from 'node:assert/strict';

import store from './storeImmut.js';

// let data = { 
//   count : 1,
//   one : {two: { three:3 }}
// }

// let st1 = store(st=>({
//   data,
//   calc : {
//     countTimes2() { return st.data.count * 2}
//   },
//   do : {
//     inc () {
//       st.update({count: st.data.count+1})
//     }
//   }

// }));

// let tmp = {subResult: undefined}
// // --



test('update or set .data deepmerges correctly', (t) => {
  let s = store(st=>({
    data: {
      zero: 0,
      one:1,
      two: {three: { fourOne: 41, fourTwo: 42} }
    }
  }));
  let tmp = {data: undefined}
  s.subscribe(st=>tmp.data = st.data);

  s.update({one:11})
  assert(tmp.data.zero === 0 && tmp.data.one === 11)

  s.update( {two: { three: { fourOne: 4141}}} )
  console.log(tmp.data)
  assert.equal(tmp.data.two.three.fourOne, 4141)
  assert.equal(tmp.data.two.thkree.fourTwo, 42)

  update(d=>{d.count++; return d})


  
});


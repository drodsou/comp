import test from 'node:test';
import assert from 'node:assert/strict';

import store from './store.js';


test('update semideep', (t) => {
  let st1 = store(st=>({
    data: {
      zero: 0,
      one:1,
      two: {three: { fourOne: 41, fourTwo: 42} }
    }
  }));
  let tmp = {data: undefined}
  st1.subscribe(st=>tmp.data = st.data);

  // -- direct assign to data + empty update
  st1.data.one = 11;
  st1.update();
  assert(tmp.data.zero === 0 && tmp.data.one === 11)

  // -- update partial assign to data
  st1.update({one:111})
  assert(tmp.data.zero === 0 && tmp.data.one === 111)

  // -- update with partial assign to data subobject
  st1.update('two.three', { fourOne: 4141} )
  assert.equal(tmp.data.two.three.fourOne, 4141)
  assert.equal(tmp.data.two.three.fourTwo, 42)
  
  
});


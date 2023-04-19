import test from 'node:test';
import assert from 'node:assert/strict';

import {stYear} from './year.js';

console.log(Object.keys(stYear.do));

await stYear.do.fetchYear()
console.log(stYear.data);
// test('attr2arr works', (t) => {
  
//   let res
//   assert(tmp.data.zero === 0 && tmp.data.one === 11)
  
// });


/*
WARNING: if this file is named the same as the .ts test, some thing wont work here
, the mess of TS asuming .js is the .ts output, et all
*/

import drsTag from './drsTag.js';

/** @type {import('./drsTag.js').Tag<{count:number}, {key:number},{}>} */
let b = drsTag(import.meta.url, {
      html: (hp)=>'html ' + hp.count
  });
console.log(b());
b.query({key:'no'})     // error string/number

/*
WARNING: if this file is named the same as the .ts test, some thing wont work here
, the mess of TS asuming .js is the .ts output, et all
*/

import drsTag from './drsTag.js';

// -- define tag
/** @type {import('./drsTag.types.d.ts').TagFunc <{count:number}, {name:string}, {len:number}> } */
const tag = drsTag ('tagname', {
  html(p) {     // enforced param type 
    return 'html ' + p.count
  },
  query(p) {   // enforced param type
    return {
      error:'', 
      data: {len: p.name.length}   // enforced error, data, .len and .len type
    }
  },
  
  update(p,e) {}     // TODO why no error if 2nd parameter, but does it bellow on tag.update ??
});

// -- use tag
tag({count:1})  // enforced
tag.update({count:3}, {}) // enforced 2 params
let q = tag.query({name: 3});   // error number not assignable to type string

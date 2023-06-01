// import assert from 'node:assert';
// import test from 'node:test';
import mivan from '../mivan.js';

export default function (C, expected='') {
  // -- common
  let html = C()
  let css = mivan.getCss()
  console.log(html+css)
  // -- console test?
  // if (expected) test('expected output', t=>{
  //   assert.strictEqual(html+css, expected)
  // });
  // -- browser (dont process.exit here or tests wont fail)
  if (typeof window !== 'undefined') {
    let escaped = (html + '\n' + css).replaceAll('&','&amp;').replaceAll('<','&lt;')
    mivan.render(`<div>${html}</div><hr><pre><code>${escaped}</code></pre>`
    , document.body);
  }
}



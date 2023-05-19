
import drsTag from '../drsTag.js';

// /** @type {import('../drsTag.d.ts').default<{count:number}, {},{}>} */
let drsTag2 = drsTag

/** @type {import('../drsTag.d.ts').Tag<{kaunt2:number}, {id_edicion:number},{}>} */
let b = drsTag2(import.meta.url, {
  html: (props)=>/*html*/`
    <h1>Counter</h1>
    <span>${props.count}</span>
  `,

  css : ()=>/*css*/`
    $T$ {
      display: inline-block;
      border: 1px dashed grey;
    }
  `
});


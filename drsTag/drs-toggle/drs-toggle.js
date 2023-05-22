
import drsTag from '../drsTag.js';

/** @type {import('../drsTag.types.d.ts').TagFunc<{label:string},{},{}>} */
let tag = drsTag(import.meta.url, {
  html: (props)=>/*html*/`
    <label>
      <span class="out">
        <input type="checkbox" checked/>
        <span class="in"></span>
      </span
      ${props.label}
    </label>
  `,

  css : ()=>/*css*/`
    $T$ * {box-sizing: border-box;}
    $T$ {
      display: inline-block;
      height: 50px;
    }
    $T$ input { display: none; }
    $T$ input:checked + .in {  background-color: red; }
    $T$ span {
      display: inline-block;
      vertical-align: top;
      height: 100%;
    }
    $T$ .out  {
      background-color: yellow;
    }
    $T$ .in {
        aspect-ratio: 1;
        border: 3px solid grey;
        border-radius: 50%;
        cursor: pointer;
      }
    }
  `
});
export default tag;

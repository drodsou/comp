import ceCount from './qp-count.js';
import ceBox from './qp-box.js';
import defineCE from '../qomp.js';



let html = ceBox('id="b1"', {value:33}, [
  ceCount('id="c1"', {count:11}, 'c1'),
  ceCount('id="c2"', {count:22}, 'c2')
]);

document.querySelector('#ssr').innerHTML = html;

// -- client: this to check 'define' does not overwrites
// for (let e of document.querySelectorAll('qp-count .inc')) {
//   e.addEventListener('click',()=>console.log('click'));
// }
// -- client hydrate
defineCE.defineAll(true);

// let hok = ceBox.render(elOrAttr, {count:1}, [

// ])

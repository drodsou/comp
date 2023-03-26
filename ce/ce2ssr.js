import ceCount from './ce2-count.js';
import ceBox from './ce2-box.js';
import defineCE from './defineCE2.js';



let html = ceBox('id="b1"', {value:33}, [
  ceCount('id="c1"', {count:11}, 'c1'),
  ceCount('id="c2"', {count:22}, 'c2')
]);

document.querySelector('#ssr').innerHTML = html;

// -- client: this to check 'define' does not overwrites
// for (let e of document.querySelectorAll('ce2-count .inc')) {
//   e.addEventListener('click',()=>console.log('click'));
// }
// -- client hydrate
defineCE.defineAll(true);

// let hok = ceBox.render(elOrAttr, {count:1}, [

// ])

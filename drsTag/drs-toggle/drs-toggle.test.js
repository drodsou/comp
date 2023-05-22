import tag from './drs-toggle.js';

let t = tag({label:'lab'})
console.log(t)

// @ts-ignore
if (typeof window !== 'undefined') { document.querySelector('#app').innerHTML = t; }

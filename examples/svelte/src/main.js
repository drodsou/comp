
import '@root/qp/qp-box.js';
import '@root/qp/qp-count.js';
import qomp from '@root/qomp/qomp.js';
qomp.defineAll();

import App from './App.svelte';




const app = new App({
  target: document.getElementById('app')
})

export default app

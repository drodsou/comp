import './app.css'
// import '../../../ce/ce-count.js';
import App from './App.svelte'

import '../../../qp/qp-box.js';
import '../../../qp/qp-count.js';
import qomp from '../../../qomp.js';
qomp.defineAll();

const app = new App({
  target: document.getElementById('app'),
})

export default app

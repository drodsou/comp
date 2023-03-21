import {compMount, $} from './comp/comp.js';

import Counter from './comp/Counter.js';
import CounterBox from './comp/CounterBox.js';
import Watch from './comp/Watch.js';
import Tooltip from './comp/Tooltip.js';

import './ce/ce-count.js';
import './ce/ce-countbox.js';
import './ce/ce-icon.js';
import './ce/ce-text.js';

// -- replace <comp> in DOM, and returns {counter1, counter2...}
const comps = compMount([
  Counter("counter1", {count: 5}),
  Counter("counter2"),
  CounterBox("counterbox1")
]);

// -- alternative way of mounting (mount() chain-reuturns comp for ease of use;
const watch = Watch("watch").mount();
Tooltip("tooltip").mount();

// -- resetting from outside
// -- using parent counterbox
document.querySelector('.reset-counters').addEventListener('click',()=>{
  [comps.counter1, comps.counter2, comps.counterbox1]
    .forEach(c=>c.update({count:-5}));
})

// -- optionally using comp's $
// -- accession counterbox children
$('.reset-counters-each').addEventListener('click',()=>{
  [comps.counter1, comps.counter2, ...comps.counterbox1.state.counters]
    .forEach((c,i)=>c.update({count:-i}));
})




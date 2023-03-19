import {compMount, $} from './comp/comp.js';

import Counter from './comp/Counter.js';
import CounterBox from './comp/CounterBox.js';

// -- replace <comp> in DOM, and returns {counter1, counter2...}
const comps = compMount([
  Counter("counter1", {count: 5}),
  Counter("counter2"),
  CounterBox("counterbox1")
]);

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


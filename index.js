import {compReplace, $} from './comp/comp.js';

import Counter from './comp/Counter.js';
import CounterBox from './comp/CounterBox.js';

const comps = compReplace([
  Counter("counter1", {count: 5}),
  Counter("counter2"),
  CounterBox("counterbox1")
]);


document.querySelector('.reset-counters').addEventListener('click',()=>{
  [comps.counter1, comps.counter2, comps.counterbox1]
    .forEach(c=>c.update({count:-5}));
})

// -- optionally using comp's $
$('.reset-counters-each').addEventListener('click',()=>{
  [comps.counter1, comps.counter2, ...comps.counterbox1.state.counters]
    .forEach((c,i)=>c.update({count:-i}));
})


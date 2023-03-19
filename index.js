import {compReplace} from './comp/comp.js';

import Counter from './comp/Counter.js';
import CounterBox from './comp/CounterBox.js';

const comps = compReplace([
  Counter("counter1", {count: 5}),
  Counter("counter2"),
  CounterBox("counterbox1")
]);


document.querySelector('.reset-counters')
  .addEventListener('click',()=>{
    // [comps.counter1, comps.counter2, comps.counterbox1.state.counter3]
    [comps.counter1, comps.counter2, comps.counterbox1]
      .forEach(c=>c.update({count:-5}));
  })




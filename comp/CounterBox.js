/*
Example use of nested component
*/

import {comp,linkCss} from './comp.js';
import Counter from './Counter.js';

// -- creates link:rel for .css file with same name of this file.
linkCss(import.meta.url);

export default comp({
  state : {
    counters : [1,2,3].map(i=>Counter('counters'+i,{count:i}))
  },
  
  render ({state}) { return /*html*/`
    <div class="counter-box">
      ${state.counters.map(c=>c.render()).join('')}
    </div>
  `}, 

  update ({state, el}) {
    let countState = state.count ? {count: state.count} : {}
    state.counters.forEach(c=>c.update( countState ))
  }

});



















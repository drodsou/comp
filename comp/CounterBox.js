/*
Example use of nested component
*/

import {comp,linkCss} from './comp.js';
import Counter from './Counter.js';

// -- creates link:rel for .css file with same name of this file.
linkCss(import.meta.url);

export default comp({
  state : {
    counter3 : Counter('counter3',{count:3})
  },
  
  render ({state}) { return /*html*/`
    <div class="counter-box">
      ${state.counter3.render()}
    </div>
  `}, 

  update ({state, $}) {
    state.counter3.update(state);
  }

});



















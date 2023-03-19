/*
Example component definition
*/

import {comp} from './comp.js';

export default comp({
  state: {
    count: 0
  },

  render ({state}) { 
    // -- use VSCode extension es6-string-html to colorize this
    return /*html*/`
      <div class="counter">
        Count: <span></span>
        <button class="inc">Inc</button>
        <button class="reset">Reset</button>
      </div>
    `;
  }, 

  update ({state,$}) {
    // -- update DOM from state
    const upd = ()=> {
      $('span').innerText = state.count;
    }
    upd();

    // -- first update
    if (!state._initialized) {
      $('.inc').addEventListener('click', (e)=>{
        state.count++; 
        upd();
      });
      $('.reset').addEventListener('click', (e)=>{
        state.count = 0; 
        upd();
      });
      return;
    }
    
  },



});



















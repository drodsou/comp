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

  update ({state,el}) {
    // -- update DOM from state
    const upd = ()=> {
      el('span').innerText = state.count;
    }
    upd();

    // -- first update
    if (!state._initialized) {
      // el('.inc').addEventListener('click', (e)=>{
      el('.inc').addEventListener('click', (e)=>{
        state.count++; 
        upd();
      });
      el('.reset').addEventListener('click', (e)=>{
        state.count = 0; 
        upd();
      });
      return;
    }
    
  },



});



















import {defineCE} from './defineCE.js';


defineCE('ce-countbox', {

  render() {
    return /*html*/`
      <div>
        <ce-count id="cb1"></ce-count>
        <ce-count id="cb2"></ce-count>
        Last counter: <span class="cbx">-</span>
      <div>
    `;
  },

  mount() {
    console.log('mount countbox')
    this.querySelector('#cb1').onChange = c=>{
      this.querySelector('.cbx').innerText = c
    }
  }

});

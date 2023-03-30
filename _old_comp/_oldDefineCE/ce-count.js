import {defineCE} from './defineCE.js';

defineCE('ce-count', {

  state : {
    count: 1
  },

  render() {
    return /*html*/`
      <button class="inc">
        ${this.innerHTML} inc <span></span>
      </button>
      <button class="reset">Reset</button>
    `;
  },

  update() {
    this.querySelector('span').innerHTML = this.state.count
    if (this.onChange) this.onChange(this.state.count);
  },

  mount() {  
    console.log('mount count')
    this.querySelector('.inc').addEventListener('click',()=>this.doInc());
    this.querySelector('.reset').addEventListener('click',()=>this.doReset());
  },

  doInc() {
    this.state.count++;
    this.update();
  },

  doReset() {
    this.setState({count:0})
  }

});

import {defineCE} from './defineCE2.js';

export default defineCE(import.meta.url, {
  props : {
    count: 1
  },

  html({innerHTML, props}) {
    return /*html*/`
      <button class="inc">
        Inc ${innerHTML}: <span>${props.count}</span>
      </button>
      <button class="reset">Reset</button>
    `;
  },
  style,

  update({el, props}) {
    el.querySelector('span').innerHTML = props.count
    if (props.onChange) props.onChange(props.count);
  },

  onMount({el}) {  
    console.log(el)
    el.querySelector('.inc').addEventListener('click',()=>el.do.inc(5));
    el.querySelector('.reset').addEventListener('click',()=>el.do.reset());
  },

  do : {
    async inc(value = 1) {
      this.props.count += value;
      this.update();
    },

    async reset() {
      this.props.count = 0;
      this.update();
    },
  }

});

// -- style

function style(tag) {
  return /*css*/`
    ${tag} {
      display:inline-block;
      padding: 10px;
    }
  `;
}

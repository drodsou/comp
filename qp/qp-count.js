import qomp from '../qomp.js';

export default qomp(import.meta.url, {
  props : {
    count : 1
  },
  attr : ['myattr'],
  css,

  html: ({props, slot}) => /*html*/`
    <button class="do-inc">
      Inc ${slot}: <span class="count">${props.count}</span>
    </button>
    <button class="do-reset">Reset</button>
    <span class="waiting"></span>
  `,
 
  update : ({props, el, set}) => {
    // el.querySelector('.count').innerHTML = props.count
    set('.count', props.count);
    set('.waiting', props.waiting ? '(wait)' : '');
  },

  events : ({el}) => [
    ['.do-inc', 'click', ()=>el.do.inc(5)]
  , ['.do-reset', 'click', ()=>el.do.reset()]
  ],

  do : {
    inc(value = 1) {
      this.props.count += value;
      this.update();
    },

    async reset() {
      const {props, update} = this;
      props.waiting = true;
      update();
      await new Promise(r=>setTimeout(r,500));  // fetch ...
      props.waiting = false;
      props.count = 0;
      update();
    },
  }

});

// -- style

function css(tag) {
  return /*css*/`
    ${tag} {
      display:inline-block;
      padding: 10px;
      border: 2px dashed grey;
    }
  `;
}

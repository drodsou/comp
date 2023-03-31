import qomp from '../qomp.js';

export default qomp(import.meta.url, {
  props : {
    count: 1
  },
  attr : ['myattr'],

  html({innerHTML, props}) {
    return /*html*/`
      <button class="inc">
        Inc ${innerHTML}: <span>${props.count}</span>
      </button>
      <button class="reset">Reset</button>
    `;
  },
  css:true,

  // upd: [
  //   ['span','innerHTML', 'count']
  // ],
  
  update({el, props, $}) {
    // $('span').innerHTML = props.count
    el.querySelector('span').innerHTML = props.count
  },
  emitChange : true,

  onMount({el, evt}) {  
    // -- evt not only more concise, it automatically removes events onDismount
    evt('.inc','click',()=>el.do.inc(5));
    evt('.reset','click',()=>el.do.reset());
    // el.querySelector('.inc').addEventListener('click',()=>el.do.inc(5));
    // el.querySelector('.reset').addEventListener('click',()=>el.do.reset());
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

function css(tag) {
  return /*css*/`
    ${tag} {
      display:inline-block;
      padding: 10px;
      border: 2px dashed grey;
    }
  `;
}

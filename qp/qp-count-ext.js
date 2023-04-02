import qomp from '../qomp/qomp.js';

export default qomp(import.meta.url, {
  css,

  html: ({props}) => /*html*/`
    <button class="do-inc">
      <slot></slot><span class="count">${props.count}</span>
    </button>
  `,
 
  update : ({props, el, set}) => {
    set('.count', props.count);
  },

  events : ({el}) => [
    ['.do-inc', 'click', ()=>el.do.inc(5)]
  ],

  do : {
    inc(value = 1) {
      this.props.count += value;
      this.update();
    },
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

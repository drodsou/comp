import qomp from '../qomp/qomp.js';

export default qomp(import.meta.url, {
  props : {
    count : 1
  },
  css: ({tag})=>`
    ${tag} { display:block; border: 1px solid red; padding: 10px;}
  `,

  // <button evt="do.inc" upd="props.count"></button>
  html: ({props}) => /*html*/`
    <button evt="do.inc">do.inc</button>
    <span upd="props.count"></span>
    <button evt="ctx.dec">ctx.dec</button>
    <slot></slot>
  `,

  do : {
    inc() {
      const {props,update} = this;
      update({count: props.count+1});
    },
  }
});

import qomp from '../qomp/qomp.js';

export default qomp(import.meta.url, {

  html: ({props}) => /*html*/`
    <hr>
    <slot>2</slot>
  `,

});


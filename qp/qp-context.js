import qomp from '../qomp/qomp.js';

export default qomp(import.meta.url, {

  html: ({props}) => /*html*/`
    <slot></slot>
  `,

});

// -- style

// function css({tag}) {
//   return /*css*/`
//     ${tag} {
//       display:inline-block;
//       padding: 10px;
//       border: 2px dashed grey;
//     }
//   `;
// }

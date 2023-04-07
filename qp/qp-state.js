import qomp from '../qomp/qomp.js';
import './qp-spin.js';

// -- common helper
export const STATA = {ABSENT:'absent', BOOTING:'booting', CRASH:'crash', DONE:'done'}
const showActiveStataOnly = (el, stata) => el.querySelectorAll(':scope > [class^=stata-]').forEach(e=>{
  if (e.classList.contains('stata-' + stata)) e.style.removeProperty('display')
  else (e.style.display = 'none');
})

export default qomp(import.meta.url, {
  props : {
    stata : STATA.ABSENT,
  },
  attr : ['stata'],
  html: ({props}) => /*html*/`
    <span class="stata-absent"></span>
    <qp-spin class="stata-booting">Booting</qp-spin>
    <span class="stata-crash">Error</span>
    <span class="stata-done">
      <slot></slot>
    </span>
  `,
 
  update : ({props, el, set}) => {
    showActiveStataOnly(el, props.stata);
  },

});

// -- style

// function css({tag}) {
//   return /*css*/`
//     ${tag} {
//       display:inline-block;
//     }
//   `;
// }


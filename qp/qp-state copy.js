import qomp from '../qomp/qomp.js';
import './qp-spin.js';

// -- common helper
export const STATA = {ABSENT:'absent', BOOTING:'booting', CRASH:'crash', DONE:'done'}
const stataClass = (myStata, stata) =>{
  let c = `stata-${myStata}`;
  if (myStata !== stata) c += ' stata-hidden'
  return c;
}
const updateVisibleStata = (el, stata) => el.querySelectorAll(':scope > [class^=stata-]').forEach(e=>{
  let myStata = e.className.match('stata-([^ ]*)')[1]
  e.className = stataClass(myStata, stata);
})

export default qomp(import.meta.url, {
  props : {
    stata : STATA.ABSENT,
  },
  attr : ['stata'],
  css: ({tag}) => /*css*/`
    ${tag} .stata-hidden {
      display: none;
    }
  `,
  html: ({props}) => /*html*/`
    <span class="${stataClass(STATA.ABSENT, props.stata)}" ></span>
    <qp-spin class="${stataClass(STATA.BOOTING, props.stata)}">Booting</qp-spin>
    <span class="${stataClass(STATA.CRASH, props.stata)}">Error</span>
    <span class="${stataClass(STATA.DONE, props.stata)}">
      <slot></slot>
    </span>
  `,
 
  update : ({props, el, set}) => {
    console.log('qp-state update');
    updateVisibleStata(el, props.stata);
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


import '../qp/qp-spin.js';

// -- common helper
export const STATA = {ABSENT:'absent', BOOTING:'booting', CRASH:'crash', DONE:'done'}

const optsDefault = {
  [STATA.ABSENT] : '',
  [STATA.BOOTING] : '<qp-spin></qp-spin>' ,
  [STATA.CRASH] : 'Crash' ,
  [STATA.DONE] : 'Done' ,
}

export function stataOption (stata, opts) {
  opts = Object.assign(optsDefault, opts);
  return /*html*/`
    <span class="stata-${stata}">${opts[stata]}</span>
  `;
}
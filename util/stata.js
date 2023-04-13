// import '../qp/qp-spin.js';

// -- common helper
export const STATA = {ABSENT:'absent', BOOTING:'booting', CRASH:'crash', DONE:'done'}

const optsDefault = {
  [STATA.ABSENT] : '',
  [STATA.BOOTING] : defaultSpinner(),
  [STATA.CRASH] : 'Crash' ,
  [STATA.DONE] : 'Done' ,
}

export function stataOption (stata, opts) {
  opts = Object.assign(optsDefault, opts);
  return /*html*/`
    <span class="stata-${stata}">${opts[stata]}</span>
  `;
}

function defaultSpinner() {
  let c = 'spinner-xhlu4g';
  return /*html*/`
    <span class="${c}">
      <style>
      .${c} {
        display: inline-block;
        aspect-ratio: 1;
        border-radius: 50%;
        animation: ${c}-anim 1s linear infinite;
        border: 4px solid rgba(255, 255, 255, 0.3);
        height: 20px;
        border-left-color: inherit;

      }
      @keyframes ${c}-anim {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg);  }
      }
      </style>
    </span>
  `;
}


/**
 * updates .stata and .row of a util/store.js on result of promise returnin {error, rows}
*/
export async function stataFetch2Store(st, stKey, prom) {
  st.update(stKey, { stata:STATA.BOOTING, rows:[]} )
  let res = await prom;
  if (res.error) st.update(stKey, { stata:STATA.CRASH, rows:[]} )
  else st.update(stKey, { stata:STATA.DONE, rows:res.rows} )
}

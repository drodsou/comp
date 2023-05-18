/*
dependent on standar vanilla store structure
*/

import xSpinner from './x-spinner.js';

export default function html (stObj, compFn) {
  if (stObj.stata === 0)  return '(absent)';
  if (stObj.stata === 1)  return xSpinner();
  if (stObj.stata === 2)  return `<div>${(stObj.rows[0]||{error:'error'}).error}</div>`;
  if (stObj.stata === 3)  return compFn(stObj);
}

html.load = async function (st, stObj, prom) {
  st.up( stObj.stata = 1 );
  let res = await prom;
  if (res.error) st.up( stObj.stata = 2, stObj.rows = [{error: res.error}] )
  else st.up( stObj.stata = 3,  stObj.rows = res.rows );
}

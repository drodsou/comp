
import {comp} from './comp.js';

export default comp({

  update ({state, el}) {
    const upd = ()=> {
      el().innerHTML = `<b>${timezoneISOString(new Date()).slice(11,19)}</b>`
    }
    upd()
    if (!state._updated) {
      state.timer = setInterval(upd,1000);
    }
  }

});


function timezoneISOString (aDate) {
  return new Date(aDate.getTime() - (aDate.getTimezoneOffset() * 60000)).toISOString();
}


















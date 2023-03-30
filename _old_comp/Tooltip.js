
import {comp} from './comp.js';

export default comp({

  render ({state, children}) {
    return /*html*/`
      <div>
        Tooltip
        <div>${children}</div>
      </div>
    `;
  },

});



















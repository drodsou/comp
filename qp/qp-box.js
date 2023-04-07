import qomp from '../qomp/qomp.js';

export default qomp(import.meta.url, {
  props : {
    value: -1
  },
  
  // ${innerHTML}  
  html({props, slot}) {
    return /*html*/`
      <div>
        <h1>ce2 box</h1>
        <div class="box-value"></div>
        <div class="children">
          <slot>box default</slot>
          <slot>second slot</slot>
        </div>
      </div>
    `;
    // ${slot}
  },
  css,
  
  update({el, props}) {
    el.querySelector('.box-value').innerHTML = props.value
  },

  do: { }
});

// -- style

function css({tag}) {
  return /*css*/`
    ${tag} {
      display:inline-block;
      border: 1px solid grey;
      padding: 10px;
    }
  `;
}


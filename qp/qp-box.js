import qomp from '../qomp.js';

export default qomp(import.meta.url, {
  props : {
    value: -1
  },
  
  // ${innerHTML}  
  html({innerHTML, props}) {
    return /*html*/`
      <div>
        <h1>ce2 box</h1>
        <div class="box-value"></div>
        <div class="children">
          <qp-count id="c3">c33</qp-count>
          <qp-count id="c4">c44</qp-count>
        </div>
      </div>
    `;
  },
  css,
  
  update({el, props}) {
    el.querySelector('.box-value').innerHTML = props.value
  },
  
  onMount({el}) {
    for (let child of el.querySelector('.children').children) {
      child.props = {onChange: (value)=>el.props={value} }
    }
  },
  do: { }
});

// -- style

function css(tag) {
  return /*css*/`
    ${tag} {
      display:inline-block;
      border: 1px solid grey;
      padding: 10px;
    }
  `;
}


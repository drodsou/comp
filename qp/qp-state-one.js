import qomp from '../qomp/qomp.js';
import {STATA} from './qp-state.js';

export default qomp(import.meta.url, {
  props : {
    stata : STATA.ABSENT,
    data : ['initial 1','initual 2']
  },

  computed : {
    propsStata() { 
      return {stata: this.props.stata} 
    }, 
  },
  
  html: ({props}) => /*html*/`
    <button>fetch</button>
    <qp-state stata="${props.stata}">
      <h1>results</h1>
      <ul class="results">
        ${htmlList({props})}
      </ul>
    </qp-state>
  `,
 
  events : ({el}) =>[
    ['button', 'click', el.do.fetch],
  ],

  // -- client update
  update : async ({props, el, set}) => {
    console.log('qp-state-one: updating');
    set('qp-state|props|computed.propsStata'); 
    // el.querySelector('qp-state').props = {stata: props.stata};
    // el.querySelector('qp-state').props = el.computed.propsStata();
    el.querySelector('.results').innerHTML = htmlList({props})
  },

  do : {
    async fetch() {
      const {update, props} = this;
      // -- fake fetch
      update({stata:'booting'});
      await new Promise(r=>setTimeout(r,1000));
      if (Math.random()<0.45) { 
        update({stata:'crash'}); 
      } else {
        update({data: ['uno','dos'], stata: 'done'});
      }
    }
  }

});

// -- HELPERS

function htmlList({props}) {
  return props.data.map(e=>'<li>'+e+'</li>').join('');
}


// -- style

// function css({tag}) {
//   return /*css*/`
//     ${tag} {
//       display:inline-block;
//     }
//   `;
// }


import qomp from '../qomp/qomp.js';
import {STATA} from './qp-state.js';

export default qomp(import.meta.url, {
  props : {
    stata : STATA.ABSENT,
    data : []
  },

  computed : {
    propsStata() { 
      return {stata: this.props.stata} 
    }
  },
  
  html: ({props}) => /*html*/`
    <button>fetch</button>
    <qp-state >
      <h1>results</h1>
      <ul class="results"></ul>
    </qp-state>
  `,
 
  events : ({el}) =>[
    ['button', 'click', el.do.fetch],
  ],

  update : async ({props, el, set}) => {
    set('qp-state|props|computed.propsStata'); 
    // el.querySelector('qp-state').props = {stata: props.stata};
    // el.querySelector('qp-state').props = el.computed.propsStata();
    el.querySelector('.results').innerHTML = props.data
      .map(e=>'<li>'+e+'</li>').join('');
  },

  do : {
    async fetch() {
      const {update, props} = this;
      console.log('fetch')
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

// -- style

// function css({tag}) {
//   return /*css*/`
//     ${tag} {
//       display:inline-block;
//     }
//   `;
// }


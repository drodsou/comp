import qomp from '../qomp/qomp.js';
import {stataOption, STATA} from '../util/stata.js';

export default qomp(import.meta.url, {
  props : {
    stata : STATA.ABSENT,
    data : ['initial 1','initual 2']
  },
  
  computed: {
    htmlStata () {
      const {props} = this;
      return stataOption(props.stata, {
        [STATA.CRASH] : 'Custom error',
        [STATA.DONE] : /*html*/`
          <h1>results</h1>
          <ul>
            ${props.data.map(e=>'<li>'+e+'</li>').join('') }
          </ul>
        `
      })
    }
  },

  html: ({computed}) => console.log('cc',computed) || /*html*/`
    <button>fetch</button><b>fetch</b>
    <div>${computed.htmlStata()}</div>
  `,
  
  // events : ({el, set}) =>
  //   ['button', 'click', el.do.fetch ],
  // ],

  events : ({set}) => set(`
    button | do.fetch;
    b | mouseover | do.fetch;
  `),

  update : async ({props, el, set}) => {
    set('div | computed.htmlStata');
    // el.querySelector('div').innerHTML = htmlStata({props});
  },

  do : {
    async fetch() {
      const {update, props} = this;
      console.log('fetch');
      // -- fake fetch
      update({stata: STATA.BOOTING});
      await new Promise(r=>setTimeout(r,1000));
      if (Math.random()>0.5) { 
        update({stata: STATA.CRASH}); 
      } else {
        update({data: ['uno','dos'], stata: STATA.DONE});
      }
    }
  }

});

// -- HELPERS




// -- style

// function css({tag}) {
//   return /*css*/`
//     ${tag} {
//       display:inline-block;
//     }
//   `;
// }


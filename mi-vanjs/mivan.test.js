import mivan from './mivan.js';

const {button, div, svg} = mivan.tags;

let st1 = { count: 2}

// ,(el)=>{console.log('el',el); if (st.count%2) { el.classList.add('odd') } else el.classList.add('odd') }

let Box = (props) => (
  div( {class:'box'},
    props.text
  )
)

let App = ()=> (
  div( {class:'div1'},
    button( {class:()=>st1.count%2 ? 'odd' : '', onclick: ()=>mivan.up(st1.count++) }, 
      ()=>st1.count
    ),
    svg( {width:24, height:24, viewBox:"0 0 24 24"}, `
      <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
      <path d="M0 0h24v24H0z" fill="none"/>
    `),
    'more',
    Box({text:'box1'})
  )
)

let app = App()
console.log(app.dyn)

// -- force same uids in regeneration
// mivan.uid.uids = [...new Set(app.dyn.map(e=>e.id))]
// let app2 = App()
// console.log(app2.dyn)

if (typeof window === 'undefined') process.exit();

// -- browser


mivan.render(app, document.body);
// document.querySelector('button').addEventListener('click',(ev)=>{ st.count++; app.update()})



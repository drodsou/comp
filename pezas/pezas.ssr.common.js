import pezas from './pezas.js';

const {button} = pezas.tags;

pezas.css.push(`
  button { border: 2px solid cyan; }
`)

let App = ()=> (
  button( {onclick: st1.action.inc}, 
    ()=>st1.data.count
  )
)

const st1 = { 
  data : {
    count: 2
  },
  view : {},
  action : {
    inc() {
      st1.data.count++;
      pezas.up();
    }
  }
}

export {st1, App}
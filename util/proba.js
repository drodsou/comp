
const a = ".btn1:click:action.inc:1 ; .btn2:click:action.dec:2"

let b = a.split(';')
  .map(a=>a.split(':').map(b=>b.trim()))
  .map(([qs,ev,fnPath, ...fnArgs])=>({qs,ev,fnPath,fnArgs}))
  .map(({qs,ev,fnPath,fnArgs})=>[ qs, ev,
    ()=>objValue(context,fnPath).apply(null,fnArgs)
  ]);

console.log(b)

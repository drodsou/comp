// -- esto lo hace bien
type FnDef = <T> ( fn: (p:T)=>string) => ((p:T)=>string))
let fnDef : FnDef = (fn) => fn;

let fn =  fnDef <{foo:number}> ( ({foo}) => 'supu' )
let r = fn({foo:1})




type F = (a:number, b:string) => void;

let f:F = (a) => {}



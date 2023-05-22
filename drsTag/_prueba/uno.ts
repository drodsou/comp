
// type Fn<T> = (one:T, two:number) => string
// type FnDef = <T> ( fn: Fn<T>) => Fn<T>
// let fnDef : FnDef = (fn) => fn;
// let fn =  fnDef <{aaa:string}> ( (one) => 'ccc' )  // why 'two' is not enforced?

// let r = fn({aaa:'bbb'}, 3)  // but here it IS enforced


type Fn<T> = (pOne:T, pTwo:number) => string    // static generic T , required con fn defin
let fn: Fn<{aaa:string}> = (pOne, pTwo) => pOne.aaa.repeat(pTwo)

let res = fn({aaa:'AAA'}, 3) // but here 'pTwo' IS enforced
console.log(res)
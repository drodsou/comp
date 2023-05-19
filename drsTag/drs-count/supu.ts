// type Fn = (props:Object) => string;
type Fn = (props: { [key: string]: any }) => string;

let fn: Fn = ({count} : {count:number}) => 'yey ' + count;


type Fn2<T> = (props: T) => string;
let fn2: Fn2<{count:number}> = ({count}) => 'yey ' + count;
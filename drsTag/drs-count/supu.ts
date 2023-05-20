
type Fn2<T> = (props: T) => string;
let fn2: Fn2<{count:number}> = ({count}) => 'yey ' + count;



type HtmlPropsBase = {
  id? : string;
  class? : string;
}

type HtmlProps<T> = HtmlPropsBase & T;


let h: HtmlProps<{count:number}> = {
  
}
h.
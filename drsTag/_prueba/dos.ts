

type HtmlFunc<HtmlProps> = (htmlProps: HtmlProps) => string; 

type QueryFunc<QueryProps, QueryReturn> = (queryProps: QueryProps) => {error:string, data: QueryReturn}; 

type TagFunc<HtmlProps, QueryProps, QueryReturn> = HtmlFunc<HtmlProps> & { 
  query: QueryFunc<QueryProps, QueryReturn>
};

type TagdefFunc = <HtmlProps, QueryProps, QueryReturn> (
  tagname: string, 
  options: { 
    html: HtmlFunc<HtmlProps>, 
    query: QueryFunc<QueryProps, QueryReturn> 
  }) => TagFunc<HtmlProps, QueryProps, QueryReturn>


//--

const tagdef : TagdefFunc = function  (tagname, { html, query }) {
  const tag = function (htmlProps:any) {
    return html(htmlProps);
  };
  tag.query = query;
  return tag;
}

const tag 
  = tagdef <{count:number}, {name:string}, {len:number}> ('tagname', {
      html({count}) {
        return 'html ' + count
      },
      query({name}) {
        return {
          error:'', 
          data: {len:name.length}
        }
      }
    }
);

// -- resumido
type Fn<T> = (o:T) => string;
type FnGen = <T> (fn: Fn<T> ) => Fn<T>

const fngen : FnGen = function (fn) {
  return (o) => fn(o)  // donde 'o' tiene el tipo forzado al tipo que se use en el parametro de la fn pasada
}

// let fn =  <{uno:string}> fngen  ( ({uno}) => ' ' + uno )   // ERROR
// let fn = fngen( ({uno} : {uno:string} )=> ' ' + uno )    // opcion 1
// let fn =  fngen <{uno:string}> ( ({uno}) => ' ' + uno )   // opcion 2
let fn : Fn<{uno:string}>  = fngen ( ({uno}) => ' ' + uno )   // opcion 3 (?)
let res = fn() // hover tiene que mostrar el parametro esperado {uno:string}

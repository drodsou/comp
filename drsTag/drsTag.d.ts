type HtmlPropsBase = {
  id? : string;
  class? : string;
}

// export type HtmlProps<T> = HtmlPropsBase & (T | {});
export type HtmlProps<T={}> = HtmlPropsBase & T;

// function kk <T> () {
//   let a: HtmlProps<T>;
//   a= {}
// }






export type QueryReturn<TQR={}> = {
  error: string;
  data: TQR
}

export type Tag <THP,TQP,TQR> =  {
  // a main render/html funcion
   (htmlProps?: HtmlProps<THP>): string; 

  // -- with added props to the function
  css: ()=>string;
  update: (
    el:(Object|Object[]),
    htmlProps?: HtmlProps<THP>
  ) => void;
  query: (queryProps?:TQP) => QueryReturn<TQR>;
}


// export type TagDef = <THP, TQP, TQR> ( 
export default TagDef = <THP, TQP, TQR> ( 
  importMetaUrl: string, 
  { 
    html, css, update, query
  } : {
    html?: (htmlProps?: HtmlProps<THP>) => string,
    css?: true | (() => string),
    update?: (
      el:(Object|Object[]),
      htmlProps?: HtmlProps<THP>
    ) => void;
    query?: (((queryProps?:TQP) => QueryReturn<TQR>)) 
  }) => Tag<THP,TQP,TQR>;


  


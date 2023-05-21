// -- tagdef props
// ---- html
export type HtmlPropsBase = {
  id? : string;
  class? : string;
  [key:string] : unknown;
}
// type HtmlPropsExtended<T_htmlProps={}> = HtmlPropsBase & T_htmlProps;
export type HtmlFunc<T_htmlProps> = (htmlProps: T_htmlProps) => string; 

// ---- css
export type CssFunc = () => string;

// ---- update
export type UpdateFunc<T_htmlProps> = (htmlProps: T_htmlProps, el: Object) => void;

// ---- query
export type QueryFunc<T_queryProps, T_queryReturn> = (queryProps: T_queryProps) 
  => {error:string, data: T_queryReturn}; 


// -- tag (tagdef return)
export type TagFunc <T_htmlProps, T_queryProps, T_queryReturn> = HtmlFunc<T_htmlProps> & { 
  css: CssFunc;
  update: UpdateFunc<T_htmlProps>;
  query: QueryFunc<T_queryProps, T_queryReturn>;
};

  // -- tagdef (main funcion)
export type TagdefFunc = <T_htmlProps extends HtmlPropsBase, T_queryProps, T_queryReturn> (
  tagname: string, 
  options: { 
    html?: HtmlFunc<T_htmlProps>;
    css?: true | CssFunc;
    update?: UpdateFunc<T_htmlProps>;
    query?: QueryFunc<T_queryProps, T_queryReturn>;
  }) => TagFunc<T_htmlProps, T_queryProps, T_queryReturn>;



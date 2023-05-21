type HtmlPropsBase = {
  id? : string;
  class? : string;
  [key:string] : unknown;
}

type HtmlFunc<T_htmlProps> = (T_htmlProps: T_htmlProps) => string; 
type UpdateFunc<T_htmlProps> = (T_htmlProps: T_htmlProps, el:Object) => void; 

type QueryFunc<T_queryProps, T_queryReturn> = (T_queryProps: T_queryProps) => {error:string, data: T_queryReturn}; 

type TagFunc<T_htmlProps, T_queryProps, T_queryReturn> = HtmlFunc<T_htmlProps> & { 
  query: QueryFunc<T_queryProps, T_queryReturn>;
  update: UpdateFunc<T_htmlProps>;
};

type TagdefFunc = <T_htmlProps extends HtmlPropsBase, T_queryProps, T_queryReturn> (
  tagname: string, 
  options: { 
    html: HtmlFunc<T_htmlProps>, 
    update: UpdateFunc<T_htmlProps>, 
    query: QueryFunc<T_queryProps, T_queryReturn> 
  }) => TagFunc<T_htmlProps, T_queryProps, T_queryReturn>


//--

const tagdef : TagdefFunc = function  (tagname, { html, query, update }) {
  const tag = function (T_htmlProps:any) {
    return html(T_htmlProps);
  };
  tag.query = query;
  tag.update = update;
  return tag;
}

// -- TEST

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
      },
      update({count}) {}

    }
);

// coj
tag({count:1})
tag.update({count:3}, {})
let q = tag.query({name:'a'});




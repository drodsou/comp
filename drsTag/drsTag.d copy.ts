export default function (
  importMetaUrl: string, 
  { html, css, update, query} : {
    html?: (htmlProps: {[key: string]: any}) => string,
    // html: (props:Object) => string,
    css?: true | (() => string),
    update?: (el:(Object|Object[])) => void;
    query?: (queryProps?:Object) => Object;
  }) :  {
    (props?: {
        [key: string]: any;
        id?: string | undefined;
        class?: string | undefined;
    }): string;
    css: ()=>string;
    update: (
      htmlProps: {[key: string]: any},
      el:(Object|Object[])
    ) => void;
    query: (queryProps?:Object) => Object;
}
export default function (
  importMetaUrl: string, 
  { html, css} : {
    html: (props:Object) => string,
    css: true | (() => string)
  }) :  {
    (props?: {
        [p: string]: any;
        id?: string | undefined;
        class?: string | undefined;
    }): string;
    css(): string;
}
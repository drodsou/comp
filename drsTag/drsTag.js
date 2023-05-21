/*
Generic "component" creator to use both in server and browser
- importMetaUrl: import.meta.url of the file defining a component, to automatically get the tag name
- {
    css: - true: for creating a css link with the same name as the component file
         - ()=>string: for creating a <style> with given css in the head, or attached to the first element
    html: (props) => string with html of the elment (plus style of css if no link, and no .css() was specifically called before calling .html())
  }
Returns a function as a wrapped html(), wich also has .css() as a property.  
Calling this last function is what returns the html and returns/sets the css

Note that even though we are using <drs-sometag> they are NOT defined custom-elements (wc), but just a custom tag. This is intentional to interop with SSR and client.
*/

let cssDone = false;

/** 
 * @type {import('./drsTag.types.d.ts').TagdefFunc} 
 */
export default function drsTag (importMetaUrl, {
  html=()=>'', 
  css=()=>'', 
  /** @type {import('./drsTag.types.d.ts').UpdateFunc} */
  update, //=(htmlProps={}, el={})=>{}, // this returns void
  query=()=>({error:'no query', data: {}})  // this returns object
}) {

  /** @type {string} */
  let tag
  try {
    // @ts-ignore
    tag = importMetaUrl.split('/').pop().split('.').shift();
  } catch (e) {
    throw new Error('importMetaUrl does not seem a valid file url: ' + importMetaUrl)
  }

  
  /** @param {import('./drsTag.types.d.ts').HtmlPropsBase} htmlProps */
  const tagFn = (htmlProps={}) => {
    let style = ''
    if (!cssDone) {
      if (typeof document !== 'undefined') {
        // -- browser
        // @ts-ignore
        document.querySelector('head').insertAdjacentHTML('afterbegin', tagFn.css() )
      } else {
        style = tagFn.css()
      }
    }
    return (
      style 
      + '<'+ tag 
      + (htmlProps.id ? ` id="${htmlProps.id}"` : '') 
      + (htmlProps.class ? ` class="${htmlProps.class}"` : '') 
      +'>' 
      // @ts-ignore
      + html(htmlProps) 
      + '</'+tag+'>'
    );
  }

  tagFn.css = ()=> {
    cssDone = true;
    if (css === true) return `<link rel="stylesheet" href="${importMetaUrl.replace('.js','.css')}" />` 
    else return `<style>${css().replaceAll('$T$',tag)}</style>`
  }
  
  tagFn.update = update ;

  // /** @typedef {import('./drsTag.d.ts').QueryResponse} QueryResponse */
  tagFn.query = query;

  return tagFn;
}

// -- TEST 






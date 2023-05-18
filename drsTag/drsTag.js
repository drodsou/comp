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
*/

let cssDone = false;

/** @type {import('./drsTag.d.ts').default} */

export default function drsTag (importMetaUrl, {html=()=>'', css=()=>''}) {

  /** @type {string} */
  let tag
  try {
    // @ts-ignore
    tag = importMetaUrl.split('/').pop().split('.').shift();
  } catch (e) {
    throw new Error('importMetaUrl does not seem a valid file url: ' + importMetaUrl)
  }

  /** 
   * The tag function to return
   * @param {{id?: string, class?:string, [p:string] : any}} props 
  */
  const htmlFn = (props={}) => {
    let style = ''
    if (!cssDone) {
      if (typeof document !== 'undefined') {
        // -- browser
        // @ts-ignore
        document.querySelector('head').insertAdjacentHTML('afterbegin', htmlFn.css() )
      } else {
        style = htmlFn.css()
      }
    }
    return (
      style 
      + '<'+ tag 
      + (props.id ? ` id="${props.id}"` : '') 
      + (props.class ? ` class="${props.class}"` : '') 
      +'>' 
      + html(props) 
      + '</'+tag+'>'
    );
  }

  htmlFn.css = ()=> {
    cssDone = true;
    if (css === true) return `<link rel="stylesheet" href="${importMetaUrl.replace('.js','.css')}" />` 
    else return `<style>${css().replaceAll('$T$',tag)}</style>`
  }

  return htmlFn;
}

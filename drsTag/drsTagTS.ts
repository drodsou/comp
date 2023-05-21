
import type {TagdefFunc} from './drsTag.types.d.ts';



let cssDone = false;


const drsTag : TagdefFunc = function (importMetaUrl, {
  html=()=>'', 
  css=()=>'', 
  update,// =(htmlProps={}, el={})=>{}, // this returns void
  query, //=()=>({error:'no query', data: {}})  // this returns object
}) {

  let tagName: string
  try {
    // @ts-ignore
    tagName = importMetaUrl.split('/').pop().split('.').shift();
  } catch (e) {
    throw new Error('importMetaUrl does not seem a valid file url: ' + importMetaUrl)
  }

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
      + html(htmlProps) 
      + '</'+tag+'>'
    );
  }

  tagFn.css = ()=> {
    cssDone = true;
    if (css === true) return `<link rel="stylesheet" href="${importMetaUrl.replace('.js','.css')}" />` 
    else return `<style>${css().replaceAll('$T$',tagName)}</style>`
  }
  
  tagFn.update = (htmlProps, el) => update(htmlProps, el);

  // /** @typedef {import('./drsTag.d.ts').QueryResponse} QueryResponse */
  tagFn.query = query;

  return tagFn;
}


// -- TEST

const tag 
  = drsTag <{count:number}, {name:string}, {len:number}> ('tagname', {
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



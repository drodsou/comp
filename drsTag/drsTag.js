let cssDone = false;

export default function  (importMetaUrl, {html=()=>'', css=()=>''} = {}) {

  const tag = importMetaUrl.split('/').pop().split('.').shift();

  const htmlFn = (props={}) => {
    let style = ''
    if (!cssDone) {
      if (typeof document !== 'undefined') {
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
    return `<style>${css().replaceAll('$T$',tag)}</style>`
  }

  return htmlFn;
}

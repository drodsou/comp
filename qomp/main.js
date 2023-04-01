// -- HELPERS

const toBase64 = btoa ? btoa : (txt)=>Buffer.from(txt).toString('base64'); 
const fromBase64 = atob ? atob : (b64)=>Buffer.from(b64, 'base64').toString('utf-8')
const nextTick = (fn) => Promise.resolve().then(fn);
const toHead = (t,attr,ch) => {
  const e = document.createElement(t);
  Object.entries(attr).forEach(([k,v])=>e.setAttribute(k,v));
  if (ch) e.append(document.createTextNode(ch));
  document.head.append(e);
}
const createStyle = ({link,css}) => {
  if (css.length >0) toHead('style', {type:'text/css'}, css);
  if (link.length > 0) {
    let links = typeof link  === 'string' ? [link] : link;
    links.forEach(l=>toHead('link', {rel:'stylesheet', href: l}));
  }
}
const CLIENT_RENDERED = 'client-rendered';



// ----------- QOMP, MAIN FUNCTION

/**
 * main creation function
 * once per tag
 * client or server
*/
export default function qomp(importMetaUrl, tag) {
  tag = Object.assign( renderServer, {
    elCount: 0, 
    importMetaUrl, 
    tagName: importMetaUrl.split('/').pop().split('.').shift(),
    props: {},
    attr : [],
    css : ()=>'',
    html : ()=>'',
    update: ()=>{},
    events: ()=>[],
    do : {},
    style, renderClient, define  // see tagdef functions bellow
  }, tag);

  // TODO: willUpdate, didUpdate, willMount, didMount, willUnmount, didUnmount

  qomp.tags.push(tag);
  return tag;
};

qomp.tags = [];

/**
 * once for all tags, client or server
 */
qomp.styleAll = function () {
  let styleAll = {link: [], css : ''};
  qomp.tags.forEach(tag=>{
    let style = tag.style();
    if (style.link) styleAll.link.push(style.link);
    if (style.css) styleAll.css += '\n' + style.css;
  });
  return styleAll;
}

// -- once for all tags, client only
qomp.defineAll = function (withStyle = true) {
  if (withStyle) createStyle(qomp.styleAll());  
  
  qomp.tags.forEach(tag=>{
    tag.define(false);   // withStyle false, as we already did it for all styles together
  });
};


// -- TAGDEF FUNCTIONS: style, render, define


/**
 * once per tag, 
 * client or server
 * wrapper of .css()
*/
function style() {
  const tag = this;
  const st = {} ;   // {link, css}

  if (tag.css === true) {
    st.link = tag.importMetaUrl.replace('.js','.css');
  } else {
    st.css = tag.css(tag.tagName).trim();
  }
  return st;
}


/**
 * Once per instance (executed), once per tag (defined)
 * client or server
 * wrapper of .html()
 * Callable from .define automatically on client, or directly on server for SSR
 * @param elOrAttr - client:dom elemnt, server string with attributes of the would be element
 */
// function render(elOrAttr='', props={}, slot='') {
//   const tag = this;
//   tag.elCount++;   // here bc it's alweays called, server or client

//   let el
//   let attr
//   if (typeof elOrAttr === 'string') attr = elOrAttr
//   else el = elOrAttr;

//   if (Array.isArray(slot)) slot = slot.join('\n');

//   let html = tag.html({props, slot});
//   if (!el) {
//     // -- ssr rendering, add stringified props for the client
//     html = `
//       <${tag.tagName} ${attr} data-props="${toBase64(JSON.stringify(props))}">
//         ${html}
//       </${tag.tagName}>
//     `;
//   }

//   return html;
// };

function renderServer(attr='', props={}, slot='') {
  const tag = this;
  tag.elCount++;   // here bc it's alweays called, server or client
  if (Array.isArray(slot)) slot = slot.join('\n');
  let html = `
    <${tag.tagName} ${attr} data-props="${toBase64(JSON.stringify(props))}">
      ${tag.html({props}).replace('<slot></slot>','<slot>' + slot + '</slot>')}
    </${tag.tagName}>
  `;
  return html;
};

function renderClient(el, props={}) {
  const tag = this;
  console.log('renderClient', tag.tagName);
  tag.elCount++;   // here bc it's alweays called, server or client

  let html = tag.html({props});
  if (!html.includes('<slot>')) {
    el.innerHTML = html;
    return;
  }

  let elTmp = document.createElement('div');
  for (let c of [...el.children]) { elTmp.appendChild(c) };
    el.innerHTML = html;
  for (let c of [...elTmp.children]) { 
    let elSlot = el.querySelector('slot');
    elSlot.parentNode.replaceChild(c, elSlot);
  };
   
  el.dataset.props = CLIENT_RENDERED;
  console.log('exit');
};


/**
 * web component definition: render html (+ insert styles) OR just hydrate (events + state + update)
 * once per instance (inside), once per tag (outside), 
 * client only
 */ 
function define(withStyle=true) {
  // -- ouside, each tag
  const tag = this;

  if (withStyle) createStyle(tag.style())

  // -- inside, EACH INSTANCE

  customElements.define(tag.tagName, class extends HTMLElement {

    constructor () {
      super();
      const el = this;
      el.mem = {
        props: Object.assign( {}, tag.props /* mountProps */),
        ready: false,
        // -- instance update, wrapper of tag .update()
        update() {
          tag.update({el, props:el.mem.props,
            set:(qs,val)=>el.querySelector(qs).innerHTML = val
          }); 
          el.dispatchEvent(new CustomEvent('change',{detail: {...el.mem.props}} ));  // works with onchange and Svelte on:change
        },
        elEvents : []
      }
      el.do = {}
      Object.entries(tag.do).forEach(([key,fn])=>{
        // el.do[key] = fn.bind(el.mem);
        el.do[key] = fn.bind(el.mem);
      })

      // el.do = el.mem.do;
    }
   
    // -- reactive .props
    set props(p) {
      const el = this;
      Object.assign(el.mem.props,p);
      if (el.mem.ready) el.mem.update();
    }
    get props() {
      const el = this;
      return {...el.mem.props}
    }

    /**
     * each instance in the html of each tagDef
     * once for each elDom
    */
    connectedCallback() {
      const el = this;
      if (this.mem.ready) {console.log('qomp skip reconnect') ;return; } // reconnected
      
      // -- this for Svelte compatibility that messes with innerHTML, removing it and appending it later
      // -- so we wait for "later" to get it
      
      nextTick(()=>{
        // -- no render if it was already SSR
        const dataProps = el.dataset.props;
        if (dataProps) {
          // -- ssr prerendered
          if (dataProps !== CLIENT_RENDERED)  { 
            // -- get stringified ssr props
            Object.assign(el.mem.props, JSON.parse(fromBase64(el.dataset.props)));
          } 
          // else  console.log('omiting client re-render'); 

        } else {
          // -- client render
          tag.renderClient(el, el.mem.props);
        }
        // -- events
        nextTick(()=>{
          // check if render() persisted, or already not in DOM (nested child already rerender, skip)
          if (!el.parentElement) return;  

          el.mem.elEvents = tag.events({el});
          el.mem.elEvents.forEach(([qs,ev,fn])=>{
            el.querySelector(qs).addEventListener(ev, fn);
          })
        });

        // -- first auto update ??  (html() should have best practices of fiilling props, even thou is redundant with update
        // el.mem.update();

        el.mem.ready = true;
      })
    } // -- connectedCallback

    // -- onDismount: autoremove event listener (if evt is used)
    disconnectedCallback() {
      const el = this;
      el.mem.elEvents.forEach(([qs,ev,fn])=> el.querySelector(qs).removeEventListener(ev, fn));
      el.mem.elEvents=[]
    }

    // -- attributes => props
    static get observedAttributes() { 
      return tag.attr; 
    }
    attributeChangedCallback(name, oldValue, newValue) {
      const el = this;
      el.props = {[name] : newValue}    // setter that triggers update
    }

  })
};


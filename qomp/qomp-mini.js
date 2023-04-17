
// -- HELPERS
const isServer = typeof window === 'undefined';
// const ctxGlobal = isServer ? global : window;
const DEBUG = (...args) =>{
  let filters
    // = '';  // show all
    // = 'upd';  // comment this for none
  if (filters !== undefined) for (let filter of filters.split(',').map(f=>f.trim())) {
    if (args.filter(a=>typeof a === 'string').join(' ').includes(filter)) console.info(...args);
  }
}
const toBase64 = isServer ? (txt)=>Buffer.from(txt).toString('base64') : btoa; 
const fromBase64 = isServer ? (b64)=>Buffer.from(b64, 'base64').toString('utf-8') : atob;
const nextTick = (fn) => Promise.resolve().then(fn);
const toHead = (t,attr,ch) => {
  const e = document.createElement(t);
  Object.entries(attr).forEach(([k,v])=>e.setAttribute(k,v));
  if (ch) e.append(document.createTextNode(ch));
  document.head.append(e);
}
const createStyle = ({link='',css=''} = {}) => {
  if (css.length >0) toHead('style', {type:'text/css'}, css);
  if (link.length > 0) {
    let links = typeof link  === 'string' ? [link] : link;
    links.forEach(l=>toHead('link', {rel:'stylesheet', href: l}));
  }
}

// ----------- QOMP, MAIN FUNCTION

/**
 * main creation function: qomp
 * once per tag
 * client or server
*/
export default function qomp (tagOrUrl, tagDef) {
  let tagName;
  let importMetaUrl;
  if (tagOrUrl.includes('/')) {
    importMetaUrl = tagOrUrl;
    tagName = importMetaUrl.split('/').pop().split('.').shift();
  } else {
    tagName = tagOrUrl;
  }

  const tagObj = Object.assign({
    elCount: 0, importMetaUrl, tagName,
    attr : [], props: {}, css : ()=>'', html : ()=>'', update: ()=>{}, events: ()=>[], do : {}, computed : {},
    style, define  // see tagdef functions bellow
  }, tagDef);
  
  const tag = tagObj;
  qomp.tags.push(tag);
  return tag;
};

qomp.tags = [];

/**
 * once for all tags, client or server
 */
qomp.styleAll = () => {
  let styleAll = {link: [], css : ''};
  qomp.tags.forEach(tag=>{
    let style = tag.style();
    if (style.link) styleAll.link.push(style.link);
    if (style.css) styleAll.css += '\n' + style.css;
  });
  return styleAll;
}

// -- once for all tags, client only
qomp.defineAll = ({styles=true}={}) => {
  if (!isServer && styles) createStyle(qomp.styleAll());  

  // TODO are we using this on server?
  qomp.tags.forEach(tag=>{
    tag.define({styles:false});   //  we already did all styles together
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
    if (tag.importMetaUrl) st.link = tag.importMetaUrl.replace('.js','.css')
    else console.warn('qomp', tag.tagName, ': defined css:true, but no importMetaUrl passed, so css link cannot be created');
  } else {
    st.css = tag.css({tag:tag.tagName}).trim(); 
  }
  return st;
}


function renderServer(attr='', props={}) {
  const el = this;
  el.mem.props = Object.assign(el.mem.props, props)
  DEBUG('renderServer', el.mem.tag.tagName, el.id);
  
  let html = 
      `<${el.mem.tag.tagName} ${attr} data-props="${toBase64(JSON.stringify(props))}">`
    + `  ${el.mem.tag.html({...el.mem})}`
    + `</${el.mem.tag.tagName}>`;

  return html;
};

function renderClient(el) {
  let html = el.mem.tag.html({...el.mem});
  if (!html.includes('<slot>')) {
    el.innerHTML = html;
    return;
  }
};


// -- ELEMENT INSTANCE DEFINITION

/**
 * Common client server
*/
function elDefine ({tag, el}) {
  tag.elCount++; 

  el.mem = {
    tag,
    props: Object.assign( {}, tag.props /* mountProps */),
    ready: false,
    // -- instance update, wrapper of tag .update()
    // TODO change tag update or this one for setstate or state or whatever, o
    update(newProps = {}) {
      Object.assign(el.mem.props, newProps);
      DEBUG(el.mem.tag.tagName, el.id, 'props updated', el.mem.props);
      if (isServer || !el.mem.ready) return;

      // -- client ready, new props?
      DEBUG(el.mem.tag.tagName, el.id, 'updating client');
      const propsStr = JSON.stringify(el.mem.props)
      if (el.mem.propsStr === propsStr) return;

      // -- new props, update
      el.mem.propsStr = propsStr;
      tag.update({el, props:el.mem.props, computed:el.mem.computed, qs: qsStr=>el.querySelector(qsStr) });
      el.dispatchEvent(new CustomEvent('change',{detail: {...el.mem.props}} ));  // works with onchange and Svelte on:change
    },

    elEvents : undefined,
    render : ()=>renderClient(el),
    el
  }

  el.do = el.mem.do = {}
  Object.entries(tag.do).forEach(([key,fn])=>{
    el.mem.do[key] = fn.bind(el.mem);
  })

  el.computed = el.mem.computed = {};
  Object.entries(tag.computed).forEach(([key,fn])=>{
    el.mem.computed[key] = fn.bind(el.mem);   // TODO: bind(el) ??
  })

  Object.defineProperty(el, "props", {
    get() { return {...el.mem.props} },
    set(v) { 
      Object.assign(el.mem.props, v) 
      el.mem.update();
    }
  })

  
  return el;

}

function define({styles=true}={}) {
  const tag = this
  if (isServer) return defineServer({tag})
  return defineClient({tag, styles})
}

function defineServer({tag}) {
  // -- ouside, each tag
  DEBUG(tag.tagName, 'defineServer');
  const el = function (...args) {
    return renderServer.apply(el, args);
  }

  return elDefine({tag, el});
}


/**
 * web component definition: render html (+ insert styles) OR just hydrate (events + state + update)
 * once per instance (inside), once per tag (outside), 
 * client only
 */ 
function defineClient({tag, styles=true}) {
  // -- ouside, each tag
  DEBUG(tag.tagName, 'defineClient');
  if (styles) createStyle(tag.style())
  
  customElements.define(tag.tagName, class extends HTMLElement {
    // -- inside, EACH INSTANCE

    constructor () {
      super();
      const el = this;
      elDefine({tag, el:this });
      DEBUG(tag.tagName, el.id, 'constructor');
    }

    /**
     * each instance in the html of each tagDef
     * once for each elDom
    */
    connectedCallback() {
      const el = this;
      if (this.mem.ready) {
        DEBUG(tag.tagName, el.id, 'skipping reconnect');
        return; 
      } 
      DEBUG(tag.tagName, el.id, 'connected');
      
      // important this be in current tick to prevent re-render in nested elements
      el.mem.ready = true;  
      
      // -- no render if it was already SSR
      const dataProps = el.dataset.props;
      if (dataProps) {
        // -- ssr prerendered, just get stringified ssr props
        DEBUG(tag.tagName, el.id, 'client hydrating');
        Object.assign(el.mem.props, JSON.parse(fromBase64(el.dataset.props)));
      } else {
        // -- client render
        DEBUG(tag.tagName, el.id, 'client rendering');
        el.mem.render();  // renderClient
      }

      // -- first auto update ??  (No, html() should have best practices of fiilling props, even thou is redundant with update
      el.mem.update();  // necesario para updateAttr, TODO: ver si se puede evitar

      // -- events from tagDef or events attribute on qp-element
      // -- [ [qs,ev,fn], ... ]
      el.mem.elEvents = tag.events({el}); 
      console.log('elev',el.tagName,  el.mem.elEvents)
      
      // -- attach events
      el.mem.elEvents.forEach(([qs,ev,fn])=>{
        DEBUG(tag.tagName, el.id, 'addEventListeners');
        let qsEl = (typeof qs === 'string') ? el.querySelector(qs) : qs;
        DEBUG(qsEl.tagName, qsEl.id, 'addEventListener', ev);
        qsEl.addEventListener(ev, fn);
      })
      
    } // -- connectedCallback


    // -- onDismount: autoremove event listener (if evt is used)
    disconnectedCallback() {

      // TODO is this used anymore now we dont use slots?
      const el = this
      if (el.parentElement) {
        DEBUG(tag.tagName, el.id, 'skipping temporal disconnect');
        return;
      }
      DEBUG(tag.tagName, el.id, 'disconnect');


      DEBUG(tag.tagName, el.id, 'removeEventListeners');
      el.mem.elEvents.forEach(([qs,ev,fn])=> {
        let qsEl = (typeof qs === 'string') ? el.querySelector(qs) : qs;
        DEBUG(qsEl.tagName, qsEl.id, 'removeEventListener', ev);
        qsEl.removeEventListener(ev, fn);
      });
      el.mem.elEvents=[]
      if (el.mem.unsubscribe) el.mem.unsubscribe();
    } // -- disconnectedCallback

    // -- attributes => props
    static get observedAttributes() { 
      return tag.attr; 
    }
    attributeChangedCallback(name, oldValue, newValue) {
      const el = this;

      console.log('qomp: attribute', name, newValue);
      el.props = {[name] : newValue}    // setter that triggers update

    };  // -- attributeChangedCallback

  })  // -- customElements.define
};  // defineClient()


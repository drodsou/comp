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
const objValue = (obj, path)=>path.reduce((prevObj, currKey) => prevObj[currKey], obj)  // ex: objValue(window,['document','body'])
const DEBUG = false;


// ----------- QOMP, MAIN FUNCTION

/**
 * main creation function: qomp
 * once per tag
 * client or server
*/
export default function qomp (importMetaUrl, tagDef) {
  const tagObj = Object.assign({
    elCount: 0, importMetaUrl, tagName: importMetaUrl.split('/').pop().split('.').shift(),
    attr : [], props: {}, css : ()=>'', html : ()=>'', update: ()=>{}, events: ()=>[], do : {}, 
    style, renderClient, define  // see tagdef functions bellow
  }, tagDef);
  tagObj.attr = tagObj.attr.concat(['subscribe','events','update']);
  // TODO: willUpdate, didUpdate, willMount, didMount, willUnmount, didUnmount
  // -- syntax sugar for SSR: qpTag('', props, children) instead of qpTag.renderServer('', props, children)
  const tag = Object.assign( (...args)=>renderServer.apply(tagObj, args), tagObj);
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
qomp.defineAll = ({styles=true, context=window}={}) => {
  if (styles) createStyle(qomp.styleAll());  

  qomp.tags.forEach(tag=>{
    tag.define({styles:false, context});   //  we already did all styles together
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

  if (tag.css === true) st.link = tag.importMetaUrl.replace('.js','.css')
  else st.css = tag.css(tag.tagName).trim(); 
  return st;
}

function renderServer(attr='', props={}, slot='') {
  const tag = this;
  tag.elCount++;   // here bc it's alweays called, server or client
  if (Array.isArray(slot)) slot = slot.join('\n');
  let html = 
      `<${tag.tagName} ${attr} data-props="${toBase64(JSON.stringify(props))}">`
    + `  ${tag.html({props}).replace('<slot></slot>',slot)}`
    + `</${tag.tagName}>`;
  return html;
};

function renderClient(el, props={}) {
  const tag = this;
  tag.elCount++;   // here bc it's alweays called, server or client

  let html = tag.html({props});
  if (!html.includes('<slot>')) {
    el.innerHTML = html;
    return;
  }

  // -- preserve already rendered children before overwrting innerHTML
  let elTmp = document.createElement('div');
  const elChildNodes = [...el.childNodes].filter(c=>c.textContent.trim());
  elChildNodes.forEach(c=>elTmp.appendChild(c));   

  el.innerHTML = html;
  for (let c of [...elTmp.childNodes]) { 
    let elSlot = el.querySelector('slot');
    if (elSlot) elSlot.parentNode.replaceChild(c, elSlot)
    else {
       console.warn( tag.tagName, el.id, ': more children than slots, or maybe bad closing tag',);
       break;
    }
  };

};


/**
 * web component definition: render html (+ insert styles) OR just hydrate (events + state + update)
 * once per instance (inside), once per tag (outside), 
 * client only
 */ 
function define({styles=true, context=window}={}) {
  // -- ouside, each tag
  const tag = this;
  DEBUG && console.log(tag.tagName, 'define');

  if (styles) createStyle(tag.style())
  
  customElements.define(tag.tagName, class extends HTMLElement {
    // -- inside, EACH INSTANCE

    constructor () {
      super();
      const el = this;
      DEBUG && console.log(tag.tagName, el.id, 'constructor');

      el.mem = {
        props: Object.assign( {}, tag.props /* mountProps */),
        ready: false,
        // -- instance update, wrapper of tag .update()
        update() {
          const propsStr = JSON.stringify(el.mem.props)
          if (el.mem.propsStr === propsStr) return;
          el.mem.propsStr = propsStr;
          
          ;(el.mem.updateAttr || tag.update)({el, props:el.mem.props, set:(qs,val)=>{
            el.querySelector(qs).innerHTML = val;}
          }); 

          el.dispatchEvent(new CustomEvent('change',{detail: {...el.mem.props}} ));  // works with onchange and Svelte on:change
        },
        elEvents : undefined
      }
      el.do = {}
      Object.entries(tag.do).forEach(([key,fn])=>{
        // el.do[key] = fn.bind(el.mem);
        el.do[key] = fn.bind(el.mem);
      })

      // el.do = el.mem.do;
      
    }

    /**
     * each instance in the html of each tagDef
     * once for each elDom
    */
    connectedCallback() {
      const el = this;
      if (this.mem.ready) {
        DEBUG && console.log(tag.tagName, el.id, 'skipping reconnect');
        return; 
      } 
      DEBUG && console.log(tag.tagName, el.id, 'connected');
      
      // -- this for Svelte compatibility that messes with innerHTML, removing it and appending it later
      // -- so we wait for "later" to get it
      nextTick(()=>{
        // -- no render if it was already SSR
        const dataProps = el.dataset.props;
        if (dataProps) {
          // -- ssr prerendered, just get stringified ssr props
          DEBUG && console.log(tag.tagName, el.id, 'client hydrating');
          Object.assign(el.mem.props, JSON.parse(fromBase64(el.dataset.props)));
        } else {
          // -- client render
          DEBUG && console.log(tag.tagName, el.id, 'client rendering');
          tag.renderClient(el, el.mem.props);
        }
        // -- events
        DEBUG && console.log(tag.tagName, el.id, 'addEventListener');
        el.mem.elEvents = el.mem.elEvents || tag.events({el});  // may be set by 'events' attribute
        el.mem.elEvents.forEach(([qs,ev,fn])=>{
          el.querySelector(qs).addEventListener(ev, fn);
        })

        // -- first auto update ??  (No, html() should have best practices of fiilling props, even thou is redundant with update
        el.mem.update();  // necesario para updateAttr, TODO: ver si se puede evitar

        el.mem.ready = true;  // important this be in current tick (WHY??)
      })
      
    } // -- connectedCallback


    // -- onDismount: autoremove event listener (if evt is used)
    disconnectedCallback() {
      const el = this
      if (el.parentElement) {
        DEBUG && console.log(tag.tagName, el.id, 'skipping temporal disconnect');
        return;
      }
      DEBUG && console.log(tag.tagName, el.id, 'disconnect');

      DEBUG && console.log(tag.tagName, el.id, 'removeEventListener');
      el.mem.elEvents.forEach(([qs,ev,fn])=> el.querySelector(qs).removeEventListener(ev, fn));
      el.mem.elEvents=[]
      if (el.mem.unsubscribe) el.mem.unsubscribe();
    } // -- disconnectedCallback
   

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

    // -- attributes => props
    static get observedAttributes() { 
      return tag.attr; 
    }
    attributeChangedCallback(name, oldValue, newValue) {
      const el = this;
      if (name === 'subscribe') {
        nextTick(()=>{
          if (el.mem.unsubscribe) el.mem.unsubscribe();
          let [store, ...path] = newValue.split('.');
          el.mem.unsubscribe = context[store].subscribe((st)=>{
            el.props = objValue(st,path)
          });
        });
      } else if (name === 'events') {
        el.mem.elEvents = newValue.split(';').map(a=>a.split(':').map(b=>b.trim()))
          .map(([qs,ev,fnPath, ...fnArgs])=>({qs,ev,fnPath,fnArgs}))
          .map(({qs,ev,fnPath,fnArgs})=>{
            const fnCtx = objValue(context,fnPath.split('.'));
            const fn = ()=>fnCtx.apply(null,fnArgs)
            return [qs,ev,fn];
          });
      } else if (name === 'update') {          
        let sets = newValue.split(';').map(a=>a.split(':').map(b=>b.trim()))
        el.mem.updateAttr = ({props, el, set}) => {
          sets.forEach(([qs,prop])=>{ set(qs, props[prop]) });
          // TODO: allow other than props, and other than innerHTML (modify set() fnction)
        }
      } else {
        el.props = {[name] : newValue}    // setter that triggers update
      }
    };  // -- attributeChangedCallback

  })  // -- customElements.define
};  // tag .define()


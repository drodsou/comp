import objPath from '../util/objPath.js';
import attr2arr from '../util/attr2arr.js';

// -- HELPERS
const isServer = typeof window === 'undefined';
const ctxGlobal = isServer ? global : window;
const DEBUG = (...args) =>{
  let filters
    // = '';  // show all
    = 'upd';  // comment this for none
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

const qpResponsible = window.qpResponsible = (ancestor, child) =>{
  if (child === ancestor)  return true
  if (child?.mem?.tag) return false;    // is of comp type but is not ancestor
  return qpResponsible(child.parentNode, ancestor);
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
  tagObj.attr = tagObj.attr.concat(['subscribe','sub','events','evt','update','upd']);
  // TODO: willUpdate, didUpdate, willMount, didMount, willUnmount, didUnmount
  // -- syntax sugar for SSR: qpTag('', props, children) instead of qpTag.renderServer('', props, children)

  // const tag = Object.assign( (...args)=>renderServer.apply(tagObj, args), tagObj);
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
qomp.defineAll = ({styles=true, ctx=ctxGlobal}={}) => {
  if (!isServer && styles) createStyle(qomp.styleAll());  

  // TODO are we using this on server?
  qomp.tags.forEach(tag=>{
    tag.define({styles:false, ctx});   //  we already did all styles together
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



function renderServer(attr='', props={}, slot='') {
  const el = this;
  el.mem.props = Object.assign(el.mem.props, props)
  DEBUG('renderServer', el.mem.tag.tagName, el.id);
  if (Array.isArray(slot)) slot = slot.join('\n');

  let html = 
      `<${el.mem.tag.tagName} ${attr} data-props="${toBase64(JSON.stringify(props))}">`
    + `  ${el.mem.tag.html({...el.mem}).replace('<slot></slot>',slot)}`
    + `</${el.mem.tag.tagName}>`;

  // -- run update attributes if exist
  let re = new RegExp(/<(\w+)([^>]*upd=")([^"]*)("[^>]*>)(<\/\1>)/)
  while (re.test(html)) {
    html = html.replace(re, (m,tagName,p2,fnPath,p4,tagEnd) => {
      console.log('P', tagName,'|',p2,'|',fnPath,'|',p4,'|',tagEnd)
      let fn = objPath(el.mem, fnPath).get()
      return '<'+tagName+p2+fn+p4+ fn() + tagEnd
    })
  };

  return html;
};


function renderClient(el) {
  
  let html = el.mem.tag.html({...el.mem});
  if (!html.includes('<slot>')) {
    el.innerHTML = html;
    return;
  }

  // -- preserve already rendered children before overwrting innerHTML
  let elTmp = document.createElement('div');

  ;[...el.childNodes].filter(c=>{
    if (c.nodeName === '#text' && c.textContent.trim().length === 0) return false;
    return true;
  }).forEach(c=>elTmp.appendChild(c));   

  el.innerHTML = html;
  let elSlots = [...el.querySelectorAll('slot')]
  let tmpChilds = [...elTmp.childNodes]
  // console.log('slots/childs', elSlots.length, tmpChilds.length);

  if (elSlots.length > 1 && tmpChilds.length > elSlots.length) {
    throw new Error(`qomp: ${el.mem.tag.tagName} ${el.id} : more children than slots, or maybe bad closing tag`);
  }

  const replaceSlot = (slot, nodeArr) =>{
    nodeArr.forEach(n=>n && slot.parentNode.insertBefore(n,slot));
    slot.remove();
  }
  // -- if 1 slot, all children in; if n slots, each children to its slot
  if (elSlots.length === 1) { replaceSlot(elSlots[0], tmpChilds) } 
  else { elSlots.forEach( (slot,i)=> replaceSlot(slot, [tmpChilds[i]] ) ); }
};





// -- ELEMENT INSTANCE DEFINITION

/**
 * Common client server
*/
function elDefine ({tag, el, ctx}) {
  tag.elCount++; 

  el.mem = {
    tag,
    ctx,
    props: Object.assign( {}, tag.props /* mountProps */),
    ready: false,
    // -- instance update, wrapper of tag .update()
    // TODO change tag update or this one for setstate or state or whatever, o
    update(newProps = {}) {
      Object.assign(el.mem.props, newProps);
      DEBUG(el.mem.tag.tagName, el.id, 'props updated', el.mem.props);
      if (isServer || !el.mem.ready) return;

      // -- client ready
      DEBUG(el.mem.tag.tagName, el.id, 'updating client');
      const propsStr = JSON.stringify(el.mem.props)
      if (el.mem.propsStr === propsStr) return;
      el.mem.propsStr = propsStr;
      
      ;(el.mem.updateAttr || tag.update)({el, props:el.mem.props, 
        // render : ()=>{
        //   if (el.mem.elEvents.length) console.warn('Using render() in update() with events is bad business, events wont be reattached, TODO:WHY?');
        //   el.mem.render()
        // }, 
        set: str=>{
          let sets = attr2arr(str).map(s=>s.length ===3 ? s : [s[0],'',s[1]])
          sets.forEach( ([qs,targetPath,valuePath]) => {
            targetPath = targetPath || 'innerHTML'
            let value = objPath(el.mem, valuePath).get()
            if (typeof value === 'function') value = value.apply(el.mem)
            let qsEl =  el.querySelector(qs)
            DEBUG(qsEl.tagName, qsEl.id, 'updating', targetPath, value);
            objPath(qsEl, targetPath).set( value );
          });
        }
      });
      // -- auto upd:
      // -- TODO: make list of this on first render, like events, so you dont have to check here if is direct children or not
      el.querySelectorAll('[upd]').forEach(qsEl=>{
        if (!qpResponsible(el, qsEl)) return;
        let valuePath = qsEl.getAttribute('upd');
        let value = objPath(el.mem, valuePath).get()
        if (typeof value === 'function') value = value.apply(el.mem);
        DEBUG(qsEl.tagName, qsEl.id, 'upd-ing', valuePath, value);
        qsEl.innerHTML = value;
      })


        // TODO: allow other than props, and other than innerHTML (modify set() fnction)
      el.dispatchEvent(new CustomEvent('change',{detail: {...el.mem.props}} ));  // works with onchange and Svelte on:change
    },

    elEvents : undefined,
    render : ()=>renderClient(el)

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

function define({styles=true, ctx=ctxGlobal}={}) {
  const tag = this
  if (isServer) return defineServer({tag, ctx})
  return defineClient({tag, styles, ctx})
}

function defineServer({tag, ctx=ctxGlobal}) {
  // -- ouside, each tag
  DEBUG(tag.tagName, 'defineServer');
  const el = function (...args) {
    return renderServer.apply(el, args);
  }

  return elDefine({tag, el, ctx});
}


/**
 * web component definition: render html (+ insert styles) OR just hydrate (events + state + update)
 * once per instance (inside), once per tag (outside), 
 * client only
 */ 
function defineClient({tag, styles=true, ctx=ctxGlobal}) {
  // -- ouside, each tag
  DEBUG(tag.tagName, 'defineClient');
  if (styles) createStyle(tag.style())
  
  customElements.define(tag.tagName, class extends HTMLElement {
    // -- inside, EACH INSTANCE

    constructor () {
      super();
      const el = this;
      elDefine({tag, el:this, ctx});
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
      
      // -- this for Svelte compatibility that messes with innerHTML, removing it and appending it later
      // -- so we wait for "later" to get it
      nextTick(()=>{
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
        el.mem.elEvents = (el.mem.eventsAttr || tag.events)({el, set: str=>{
          let sets = attr2arr(str).map(s=>s.length ===3 ? s : [s[0],'',s[1]])
          .map( ([qs,ev,fnPath]) => {
            ev = ev || 'click'
            const fnBase = objPath(el.mem, fnPath).get();
            const fn = ()=>fnBase.apply(el.mem)
            return [qs,ev,fn];
          });
          return sets;
        }}); 
        
        // -- auto evt: events from evt on children
        el.querySelectorAll('[evt]').forEach(e=>{
          let fnPath = e.getAttribute('evt');
          const fnBase = objPath(el.mem, fnPath).get();
          const fn = ()=>fnBase.apply(el.mem)
          el.mem.elEvents.push([e,'click',fn])
        })
        
        
        // -- attach events
        el.mem.elEvents.forEach(([qs,ev,fn])=>{
          DEBUG(tag.tagName, el.id, 'addEventListeners');
          let qsEl = (typeof qs === 'string') ? el.querySelector(qs) : qs;
          DEBUG(qsEl.tagName, qsEl.id, 'addEventListener', ev);
          qsEl.addEventListener(ev, fn);
        })

        

        

      })
      
    } // -- connectedCallback


    // -- onDismount: autoremove event listener (if evt is used)
    disconnectedCallback() {
      const el = this
      if (el.parentElement) {
        DEBUG(tag.tagName, el.id, 'skipping temporal disconnect');
        return;
      }
      DEBUG(tag.tagName, el.id, 'disconnect');

      DEBU(tag.tagName, el.id, 'removeEventListeners');
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

      if (['subscribe','sub'].includes(name)) {
        nextTick(()=>{
          if (el.mem.unsubscribe) el.mem.unsubscribe();
          const [_, store, ...path] = newValue.split('.');
          el.mem.unsubscribe = ctx[store].subscribe((st)=>{
            el.props = objPath(st, path).get()     
          });
        });
      } 
      

      // TODO make this like update, so in tagDef can use same syntax than via attriubte
      else if (['events','evt'].includes(name)) {
        el.mem.eventsAttr = ({set}) => set(newValue)      
      } 
      
      else if (['update'].includes(name)) {          
        el.mem.updateAttr = ({set}) => set(newValue)
      } 
      
      else {
        console.log('qomp: attribte', name, newValue);
        el.props = {[name] : newValue}    // setter that triggers update
      }
    };  // -- attributeChangedCallback

  })  // -- customElements.define
};  // defineClient()








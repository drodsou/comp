const tags1 = `area,base,br,col,embed,hr,img,input,keygen,link,meta,param,source,track,wbr`;
const tags2 = `a,abbr,acronym,address,applet,article,aside,audio,b,base,basefont,bdi,bdo,bgsound,big,blink,blockquote,body,button,canvas,caption,center,cite,code,colgroup,command,content,data,datalist,dd,del,details,dfn,dialog,dir,div,dl,dt,element,em,fieldset,figcaption,figure,font,footer,form,frame,frameset,h1,h2,h3,h4,h5,h6,head,header,hgroup,html,i,iframe,image,ins,isindex,kbd,label,legend,li,listing,main,map,mark,marquee,math,menu,menuitem,meter,multicol,nav,nextid,nobr,noembed,noframes,noscript,object,ol,optgroup,option,output,p,picture,plaintext,pre,progress,q,rb,rbc,rp,rt,rtc,ruby,s,samp,script,section,select,shadow,slot,small,spacer,span,strike,strong,style,sub,summary,sup,svg,table,tbody,td,template,textarea,tfoot,th,thead,time,title,tr,tt,u,ul,var,video,xmp`;

/**
 * generates new uid, or gets next from uids[] if exist (for repeatable App rendering in SSR/client)
 */
function uid () {
  let ret
  if (uid.uids.length > 0) { ret =  uid.uids.shift(); console.log('hydrating')} 
  else {  ret = crypto.randomUUID().slice(0,8)  }
  return ret;
}
uid.uids = []

const dyn = []
const css = []

function addCss(str) {
  css.push(str)
}

// function htmlIds() {
//   let ids = [...new Set(this.dyn.map(e=>e.id))]
//   return `\n<pezas-uids style="display:none;">${JSON.stringify(ids)}</pezas-uids>`
// }

function htmlIds() {
  let uids = [...new Set(dyn.map(e=>e.id))]
  return `\n<pezas-uids style="display:none;">${JSON.stringify(uids)}</pezas-uids>`
}



/**
 * normalize strings, object.html and object[].html to strings
 */
function tval(val) {
  // if (val.html) return val.html
  if (Array.isArray(val)) return val.join('\n')
  if (typeof val === 'function') return val()
  return val
}


const isObj = (x) => Object.prototype.toString.call(x) === '[object Object]';

function createTag (tagName, closingTag=true) {

  let tag = function (...propsAndChildren) {
    let props, children;
    if (isObj(propsAndChildren[0])) { 
      [props, ...children] = propsAndChildren; 
    } else { 
      [props, children] = [{}, propsAndChildren]; 
    }

    children = children.flat();   // TODO: needed ?, redundant with tval array?
    let html = '<' + tagName

    // -- PROPS
    let tagId
    Object.keys(props).forEach(pk=>{
      if (pk.startsWith('on')) {
        // -- event
        let evt = pk.slice(2)
        if (!tagId) {
          tagId = uid()
          html += ` data-tagid="${tagId}"`;
        }
        // events.push({id:tagId, evt, fn: props[pk]})     // should be function
        dyn.push({id:tagId, type:'event', prop:evt, fn: props[pk]})     // should be function
        return;
      }

      if (typeof props[pk] === 'function') {
        // -- prop bind
        if (!tagId) {
          tagId= uid()
          html += ` ${pk}="${props[pk]()}" data-tagid="${tagId}"`;
        } else {
          html += ` ${pk}="${props[pk]()}"`;
        }
        dyn.push({id:tagId, type:'bind', prop:pk, fn: props[pk]})     // should be function
        return;
      }

      return html += ` ${pk}="${props[pk]}"`;
    })
    html += '>'

    if (closingTag) {
      // -- CHILDREN
      children.forEach(c=>{
        if (typeof c === 'function') { 
          // -- child bind
          let childId = uid();
          dyn.push({id:childId, type:'bind', prop:'innerHTML', fn: c})     // should be function
          html += `<span data-tagid="${childId}">${tval(c())}</span>`
          return;
        }

        // -- plain text
        return html += c;
      })

      html += '</' + tagName + '>'
    } // -- closingTag

    // ;!'br,input'.includes(tagName) && html += '</'div>'
    return html;
  }
  tag.tagName = tagName
  return tag;
}

// -- create all tags
const tags = {};
tags1.split(',').forEach(t=>tags[t] = createTag(t, false))
tags2.split(',').forEach(t=>tags[t] = createTag(t, true))
tags.tag = (tagName, ...propsAndChildren) => createTag(tagName,true)(...propsAndChildren)

function getCss() {
  let cssLinks = '';
  let cssStyles = '';
  for (let c of css) {
    if (c.endsWith('.css')) cssLinks += `<link rel="stylesheet" href="${c}" />\n`
    else cssStyles += c + '\n';
  }
  return cssLinks + '\n<style>' + cssStyles + '</style>';
}

function addEvents() {
  for (let e of dyn) {
    if (e.type !== 'event') continue;
    document.querySelector(`[data-tagid="${e.id}"]`).addEventListener(e.prop,e.fn)
  }
}

function css2head () {
  document.querySelector('head').insertAdjacentHTML('beforeEnd', getCss())
}

/** rendered: if rendering several isles */
let rendered = false

function render (vanEl, domEl) {
  if (typeof domEl === 'string') domEl = document.querySelector(domEl)
  if (!rendered) css2head()  
  domEl.insertAdjacentHTML('beforeEnd', vanEl) 
  if (!rendered) addEvents()
  rendered = true;
}

function hydrate (...vanEls) {
  let uidsSsrEl = document.querySelector('pezas-uids')
  if (uidsSsrEl) uid.uids = JSON.parse(uidsSsrEl.innerText)
  addEvents()
}


function update() {
  for (let b of dyn) {
    if (b.type !== 'bind') continue;
    let el=document.querySelector(`[data-tagid="${b.id}"]`)
    if (!el) continue;  // svelte first time, also vanilla: warning?
    let prop = b.prop
    if (prop === 'class') prop = 'className'
    el[prop] = tval(b.fn(el))
  }
}


const file = (importMetaUrl) => importMetaUrl.split('/').pop().split('.').shift(); 

export default {tags, createTag, up:update, update, file, render, hydrate, css, addCss, getCss, htmlIds}



const tags1 = `area,base,br,col,embed,hr,img,input,keygen,link,meta,param,source,track,wbr`;
const tags2 = `a,abbr,acronym,address,applet,article,aside,audio,b,base,basefont,bdi,bdo,bgsound,big,blink,blockquote,body,button,canvas,caption,center,cite,code,colgroup,command,content,data,datalist,dd,del,details,dfn,dialog,dir,div,dl,dt,element,em,fieldset,figcaption,figure,font,footer,form,frame,frameset,h1,h2,h3,h4,h5,h6,head,header,hgroup,html,i,iframe,image,ins,isindex,kbd,label,legend,li,listing,main,map,mark,marquee,math,menu,menuitem,meter,multicol,nav,nextid,nobr,noembed,noframes,noscript,object,ol,optgroup,option,output,p,picture,plaintext,pre,progress,q,rb,rbc,rp,rt,rtc,ruby,s,samp,script,section,select,shadow,slot,small,spacer,span,strike,strong,style,sub,summary,sup,svg,table,tbody,td,template,textarea,tfoot,th,thead,time,title,tr,tt,u,ul,var,video,xmp`;

/**
 * generates new uid, or gets next from uids[] if exist (for repeatable App rendering in SSR/client)
 */
function uid () {
  let ret
  if (uid.uids.length > 0) { ret =  uid.uids.shift(); } 
  else {  ret = crypto.randomUUID().slice(0,8)  }
  return ret;
}
uid.uids = []



function htmlIds() {
  let ids = [...new Set(this.dyn.map(e=>e.id))]
  return `\n<mivan-uids style="display:none;">${JSON.stringify(ids)}</mivan-uids>`
}


function createTag (tagName, closingTag=true) {
  let tag = function (props={}, ...children) {
    children = children.flat();
    let dyn = []
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

        // -- nested child
        if (c.html) {
          html += c.html;
          dyn = dyn.concat(c.dyn)
          return;
        }

        // -- plain text
        return html += c;
      })

      html += '</' + tagName + '>'
    } // -- closingTag

    // ;!'br,input'.includes(tagName) && html += '</'div>'
    return {html, dyn, htmlIds};
  }
  tag.tagName = tagName
  return tag;
}

// -- create all tags
const tags = {};
tags1.split(',').forEach(t=>tags[t] = createTag(t, false))
tags2.split(',').forEach(t=>tags[t] = createTag(t, true))

function tval(val) {
  if (val.html) return val.html
  if (Array.isArray(val)) return val.map(v=>v.html ? v.html : v).join('\n')
  return val
}

function getCSS() {
  let h = '';
  links.forEach(link=>{
    if (link) h += `<link rel="stylesheet" href="${link}" />\n` 
  });
  h += `<style>${styles.join('\n')}</style>`
  return h;
}

const rendered = []

function render (vanEl, domEl=undefined) {
  // -- if hydrating omit first render
  if (domEl) { 
    domEl.insertAdjacentHTML('beforeEnd', vanEl.html) 
    document.querySelector('head').insertAdjacentHTML('beforeEnd', getCSS())
  }
  rendered.push(vanEl)
  // -- attach events
  vanEl.dyn.forEach(e=>{
    if (e.type !== 'event') return;
    document.querySelector(`[data-tagid="${e.id}"]`).addEventListener(e.prop,()=>{e.fn()})
  })
}

function hydrate(vanFn) {
  uid.uids = JSON.parse(document.querySelector('mivan-uids')?.innerText)
  // console.log('hydrating', uid.uids)
  render(vanFn())
}

function update() {
  rendered.forEach(vanEl=>{
    vanEl.dyn.forEach(b=>{
      if (b.type !== 'bind') return;
      let el=document.querySelector(`[data-tagid="${b.id}"]`)
      let prop = b.prop
      if (prop === 'class') prop = 'className'
      el[prop] = tval(b.fn(el))
    })
  })
}

const links = ['']
const styles = ['']
const file = (importMetaUrl) => importMetaUrl.split('/').pop().split('.').shift(); 

export default {tags, createTag, render, hydrate, up:update, update, links, styles, file, getCSS}





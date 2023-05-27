
function uid () {
  let ret
  if (uid.uids.length > 0) { ret =  uid.uids.shift(); console.log('tira', ret) } 
  else {  ret = crypto.randomUUID().slice(0,8)  }
  return ret;
}
uid.uids = []



function htmlIds() {
  let ids = [...new Set(this.dyn.map(e=>e.id))]
  return `\n<mivan-uids style="display:none;">${JSON.stringify(ids)}</mivan-uids>`
}


function createTag (tagName) {
  let tag = function (props, ...children) {
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

    // -- CHILDREN
    children.forEach(c=>{
      if (typeof c === 'function') { 
        // -- child bind
        let childId = uid();
        dyn.push({id:childId, type:'bind', prop:'innerHTML', fn: c})     // should be function
        html += `<span data-tagid="${childId}">${c()}</span>`
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

    // ;!'br,input'.includes(tagName) && html += '</'div>'
    return {html, dyn, htmlIds};
  }
  tag.tagName = tagName
  return tag;
}

const tags = {};
;['div','button','svg'].forEach(t=>tags[t] = createTag(t))

const rendered = []

function render (vanEl, domEl=undefined) {
  // -- if hydrating omit first render
  if (domEl) { domEl.insertAdjacentHTML('beforeEnd', vanEl.html) }
  

  rendered.push(vanEl)
  // -- attach events
  vanEl.dyn.forEach(e=>{
    if (e.type !== 'event') return;
    document.querySelector(`[data-tagid="${e.id}"]`).addEventListener(e.prop,()=>{e.fn()})
  })
}
function hydrate(vanFn) {
  uid.uids = JSON.parse(document.querySelector('mivan-uids')?.innerText)
  console.log('hydrating', uid.uids)
  render(vanFn())
}

function update() {
  rendered.forEach(vanEl=>{
    vanEl.dyn.forEach(b=>{
      if (b.type !== 'bind') return;
      let el=document.querySelector(`[data-tagid="${b.id}"]`)
      let prop = b.prop
      if (prop === 'class') prop = 'className'
      el[prop] = b.fn(el)
    })
  })
}

export default {tags, render, hydrate, up:update, update}





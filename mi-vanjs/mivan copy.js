
function uid () {
  if (uid.uids.length > 0) return uid.uids.unshift()
  else return 'c' + Math.floor(Math.random()*1000) + Date.now()
}
uid.uids = []

function createTag (tagName) {
  let tag = function (props, ...children) {
    let binds = []
    let events = []
    let uids = []
    let html = '<' + tagName

    // -- PROPS
    let tagId
    Object.keys(props).forEach(pk=>{
      if (pk.startsWith('on')) {
        // -- event
        let evt = pk.slice(2)
        if (!tagId) {
          tagId = uids.push(uid())
          html += ` data-tagid="${tagId}"`;
        }
        events.push({id:tagId, evt, fn: props[pk]})     // should be function
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
        binds.push({id:tagId, prop:pk, fn:props[pk]})
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
        binds.push({id:childId, prop:'innerHTML', fn:c})
        html += `<span data-tagid="${childId}">${c()}</span>`
        return;
      }

      // -- nested child
      if (c.html) {
        html += c.html;
        binds = binds.concat(c.binds)
        events = events.concat(c.events)
        return;
      }

      // -- plain text
      return html += c;
    })

    html += '</' + tagName + '>'

    // ;!'br,input'.includes(tagName) && html += '</'div>'
    return {html, binds, events};
  }
  tag.tagName = tagName
  return tag;
}

const tags = {};
;['div','button','svg'].forEach(t=>tags[t] = createTag(t))

const rendered = []
function render (vanEl, domEl) {
  domEl.insertAdjacentHTML('beforeEnd', vanEl.html)
  rendered.push(vanEl)
  // -- attach events
  vanEl.events.forEach(e=>{
    document.querySelector(`[data-tagid="${e.id}"]`).addEventListener(e.evt,()=>{e.fn()})
  })
}

function update() {
  rendered.forEach(vanEl=>{
    vanEl.binds.forEach(b=>{
      let el=document.querySelector(`[data-tagid="${b.id}"]`)
      let prop = b.prop
      if (prop === 'class') prop = 'className'
      el[prop] = b.fn(el)
    })
  })
}

export default {tags, render, up:update, update, uid}





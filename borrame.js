Given this javascript code:

---
let fn = {
  update() { return `<span>content</span>` }
}

let tpl = `
<h1>title</h1>
<div>above</div>
<div fn="update"></div>
<span fn="update"></span>
<div>bellow</div>
`

let expectedResult = `
<h1>title</h1>
<div>above</div>
<div fn="update"><span>content</span></div>
<span fn="update"><span>content</span></span>
<div>bellow</div>
`
---

Write a javascript function that takes 'fn' and 'tpl' as arguments and returns a string equal to 'expecteResult'



function updateTemplate(fn, tpl) {
  let updatedTpl = tpl.replace(/<(\w+)\s+fn="([^"]+)"><\/\1>/g, (match, p1, p2) => {    
    if (fn.hasOwnProperty(p2)) {      
      return `<${p1} fn="${p2}">${fn[p2]()}</${p1}>`;
    } else {
      return match;
    }
  });
  return updatedTpl;
}
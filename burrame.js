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

function trans() {

  let re = new RegExp(/<(\w+)([^>]*fn=")([^"]*)("[^>]*>)(<\/\1>)/)

  let r = tpl;
  while (re.test(r)) {
    r = r.replace(re, (m,p1,p2,p3,p4,p5) => {
      console.log('P', p1,'|',p2,'|',p3,'|',p4,'|',p5)
      return '<'+p1+p2+p3+p4+fn[p3]()+p5
    })
  };
  
  return  r
}
console.log(trans())



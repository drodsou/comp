const tag = import.meta.url.split('/').pop().split('.').shift();

export default function html (props) {
  return `
    <${tag}>
      ${props.rows.map((e,i)=>`
        <div>${e}</div>
      `).join('')}
    </${tag}>
  `
};

html.css = ()=>/*css*/`
  ${tag} {
    border: 1px solid dashed;
  }
`;

html.query = async () => {
  // fake fetch
  console.log('query in')
  let res = await new Promise( r => setTimeout(()=>{
    if (Math.random() > 0.33) r({error:false, rows: ['one','two']})
    else r({error: 'i told you', rows: [] })
  },500))
  console.log('query out', res)
  return res;
}

// -- common
try {
 document.querySelector('head').insertAdjacentHTML('afterbegin',`<style>${html.css()}</style>`)
} catch (e) {}


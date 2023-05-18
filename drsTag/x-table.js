const tag = import.meta.url.split('/').pop().split('.').shift();

// const fakeProps = {
//   rows : [
//     {col1: 'c1r1', col2: 'c2r1'},
//     {col1: 'c1r2', col2: 'c2r2'},
//   ],
//   cols : [
//     {id: 'col1', label: 'COL1'},
//     {id: 'col2', label: 'COL2'},
//   ],
//   key : 'col1',
//   selectedKey: 'c1r2'
// }

export default function html (props) {
  return `
    <${tag}>
      <table>
        <thead>
          ${thead(props)}
        </thead>
        <tbody>
          ${tbody(props)}
        </tbody>
      </table>
    </${tag}>
  `
}

// -- helpers
function thead (props) {
  return (
    '<tr>'
    + props.cols.map((col)=>(
        '<th>'+(col.label||col.id)+'</th>'
    )).join('')
    + '</tr>'
  )
};

function tbody (props) {
  let key = props.key || Object.keys(props.rows[0]||{})[0];
  console.log('key', key)
  return props.rows.map((row)=>(
    `<tr data-key="${row[key]}" ${props.selectedKey === row[key] ? 'data-selected' : ''} >`
    + Object.entries(row).map(([k,v])=>(
        `<td>${v}</td>`
    )).join('')
    + '</tr>'
    )
  ).join('')
};



html.css = () => {
  return /*css*/`
    // ${tag} {
    //   display: block;
    //   padding: 10px;
    //   border: 2px dashed grey;
    // }

    ${tag} table {
      border-collapse: collapse;
      cursor: pointer;
      width: 100%;
    }

    ${tag} tr {
      border-bottom: 1px solid grey;
    }

    ${tag} th {
      text-align: left;
    }

    ${tag} th, td {
      padding: 0.5rem;
    }

    ${tag} [data-selected] {
      background-color: grey;
    }
  `;
}


// -- common
try {
  document.querySelector('head').insertAdjacentHTML('afterbegin',`<style>${html.css()}</style>`)
} catch (e) {}


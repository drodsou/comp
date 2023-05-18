/*
Warning: as .d.ts file has same name, you must export there the default type
or you'll get a TS error that the funcion exported here has no call signature
even though JS would work ok
*/

import drsTag from './drsTag.js';

export default drsTag( import.meta.url, {

  html(props) {
    return `
      <table>
        <thead>
          ${thead(props)}
        </thead>
        <tbody>
          ${tbody(props)}
        </tbody>
      </table>
    `
  },
  css: true
  // css : ()=>/*css*/`
 
  //   $T$ table {
  //     border-collapse: collapse;
  //     cursor: pointer;
  //     width: 100%;
  //   }

  //   $T$ tr {
  //     border-bottom: 1px solid grey;
  //   }

  //   $T$ th {
  //     text-align: left;
  //   }

  //   $T$ th, td {
  //     padding: 0.5rem;
  //   }

  //   $T$ [data-selected] {
  //     background-color: grey;
  //   }
  // `

}); // drsTag


// -- helpers

function thead ({cols}) {
  return (
    '<tr>'
    + cols.map((col)=>(
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




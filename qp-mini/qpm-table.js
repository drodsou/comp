import qomp from '../qomp/qomp-mini.js';

export default qomp(import.meta.url, {
  props : {
    rows : [
      {col1: 'c1r1', col2: 'c2r1'},
      {col1: 'c1r2', col2: 'c2r2'},
    ],
    cols : [
      {id: 'col1', label: 'COL1'},
      {id: 'col2', label: 'COL2'},
    ],
    key : 'col1',
    selectedKey: 'c1r2',
  },
  computed: {
    thead() {
      return (
        '<tr>'
        + this.props.cols.map((col)=>(
            '<th>'+(col.label||col.id)+'</th>'
        )).join('')
        + '</tr>'
      )
    },

    tbody() {
      let key = this.props.key || Object.keys(this.props.rows[0]||{})[0];
      console.log('key', key)
      return this.props.rows.map((row)=>(
        `<tr data-key="${row[key]}" ${this.props.selectedKey === row[key] ? 'data-selected' : ''} >`
        + Object.entries(row).map(([k,v])=>(
            `<td>${v}</td>`
        )).join('')
        + '</tr>'
        )
      ).join('')
    }
  },
  css,

  html: ({props, computed}) => `
    <table>
      <thead>
        ${computed.thead()}
      </thead>
      <tbody>
        ${computed.tbody()}
      </tbody>
    </table>
  `,
 
  update : ({el, props, computed, qs}) => {
    qs('thead').innerHTML = computed.thead();
    qs('tbody').innerHTML = computed.tbody();

  },


  events : ({el}) => [
    ['table', 'click', (ev)=>el.do.select(ev)]

  ],

  do : {
    select(ev) {
      this.props.selectedKey = ev.target.parentNode.dataset.key;
      this.el.dispatchEvent(new CustomEvent('select',{detail: {key: this.props.selectedKey}} ));  // works with onchange and Svelte on:change
      this.update();
    },
  }

});

// -- style

function css({tag}) {
  return /*css*/`
    ${tag} {
      display:block;
      padding: 10px;
      border: 2px dashed grey;
    }

    ${tag} table {
      border-collapse: collapse;
      cursor: pointer;
    }


    ${tag} [data-selected] {
      background-color: teal;
    }
  `;


}

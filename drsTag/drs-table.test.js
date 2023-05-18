import drsTable from './drs-table.js';

let props =  {
  rows : [
    {col1: 'c1r1', col2: 'c2r1'},
    {col1: 'c1r2', col2: 'c2r2'},
  ],
  cols : [
    {id: 'col1', label: 'COL1'},
    {id: 'col2'},
  ],
  key : 'col1',
  selectedKey: 'c1r2'
}

console.log( drsTable(props) );
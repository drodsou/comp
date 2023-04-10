
const data = {
  year : [ 
    {id_year: '2021'},
    {id_year: '2022'}
  ],

  course : [
    {id_year: '2021', id_course: '2021-c1'},
    {id_year: '2021', id_course: '2021-c2'},
    {id_year: '2022', id_course: '2022-c1'},
  ],

  course_student : [
    {id_course: '2021-c1', id_student: 'anakin'},
    {id_course: '2021-c2', id_student: 'anakin'},
    {id_course: '2021-c2', id_student: 'boromir'},
    {id_course: '2022-c1', id_student: 'boromir'},
  ]

}

async function query(table) {
  await new Promise(r=>setTimeout(r,800));
  console.log('table', table)
  if (Math.random() > 0.66) return {error: true, rows: []}
  else return {error: false, rows: [...data[table]]}
}

export default {query}

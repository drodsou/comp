


htmlYear () {
  return stataDone(st.data.year.stata, `
    <h2>Years</h2>
    <select do="st1.selectYear|change">
      <option value="">-</option>
      ${st.data.year.rows.map(r=>`
        <option ${(r.id_year == st.data.year.selected) && 'selected'}  
          value="${r.id_year}"
        >${r.id_year}</option>
      `).join('')}
    </select>
  `,'Error fetching years');
},

fetchYear() {
  st.data.course.stata = STATA.ABSENT;
  st.data.student.stata = STATA.ABSENT;
  st.update();
  // stataDbQuery('year',st,'year');
  stataFetch2Store(st,'year', db.query('year') );
},
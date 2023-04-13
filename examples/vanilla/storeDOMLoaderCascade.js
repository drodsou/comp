/*
TODO: revisar que no haga mill updates si recheck = true, 
comprobar que funciona  select on check
que no repiten select al hacer check, sino van a ir quedando event listeners perdidos por un tubo
*/
import store from '/util/store.js';
import storeDOM from '/util/storeDOM.js';
import {stataOption, stataFetch2Store, STATA} from '/util/stata.js';
import db from '/util/fakeDB.js';


const st1 = store(st=>({
  data : {
    year : {
      stata: STATA.ABSENT,
      rows : [],
      selected: ''
    },
    course : {
      stata: STATA.ABSENT,
      rows : [],
      selected: ''
    },
    student : {
      stata: STATA.ABSENT,
      rows : [],
      selected: ''
    },
  },

  calc: {
    htmlYear () {
      return stataOption(st.data.year.stata, {
        [STATA.DONE] : `
          <h2>Years</h2>
          <select do="st1.selectYear|change">
            <option value="">-</option>
            ${st.data.year.rows.map(r=>`
              <option ${(r.id_year == st.data.year.selected) && 'selected'}  
                value="${r.id_year}"
              >${r.id_year}</option>
            `).join('')}
          </select>
        `
      })
    },
    htmlCourse () {
      return stataOption(st.data.course.stata, {
        [STATA.DONE] : `
          <h2>Courses of year ${st.data.year.selected}</h2>
          <select do="st1.selectCourse|change">
            <option value="">-</option>
            ${st.data.course.rows.map(r=>`
              <option ${(r.id_course == st.data.course.selected) && 'selected'}
                value="${r.id_course}"
              >${r.id_course}</option>
            `).join('')}
          </select>
        `
      })
    }

  },
  do : {
    fetchYear() {
      st.data.course.stata = STATA.ABSENT;
      st.data.student.stata = STATA.ABSENT;
      st.update();
      // stataDbQuery('year',st,'year');
      stataFetch2Store(st,'year', db.query('year') );
    },
    
    selectYear() {
      const el = this;
      st.update('year', {selected: el.value});
      stataFetch2Store(st,'course', db.query('course').then(res=>{
        if (res.error) return res;
        res.rows = res.rows.filter(course=>course.id_year === st.data.year.selected);
        return res;
      }) );
    },

    selectCourse() {
      const el = this;
      st.update('course', {selected: el.value});
      console.log('selected course', el.value);
    }


  }, 
}));

storeDOM({st1}, true);
st1.do.fetchYear();
st1.subscribe(d=>console.log(JSON.stringify(d.data,null,2)))


// -- HELPERS

// async function stataDbQuery(table, st, stKey) {
//   st.update(stKey, { stata:STATA.BOOTING, rows:[]} )
//   console.log('booting done')
//   let res = await db.query(table);
//   if (res.error) 
//     st.update(stKey, { stata:STATA.CRASH, rows:[]} )
//   else
//     st.update(stKey, { stata:STATA.DONE, rows:res.rows} )
// }





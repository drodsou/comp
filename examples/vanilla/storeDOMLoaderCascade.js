/*
TODO: revisar que no haga mill updates si recheck = true, 
comprobar que funciona  select on check
que no repiten select al hacer check, sino van a ir quedando event listeners perdidos por un tubo
*/
import store from '/util/store.js';
import storeDOM from '/util/storeDOM.js';
import {stataOption, STATA} from '/util/stata.js';
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
          <select do="st1.selectYear|change">
            ${st.data.year.rows.map(r=>`
              <option value="${r.id_year}">${r.id_year}</option>
            `).join('')}
          </select>
        `
      })
    }

  },
  do : {
    fetchYear() {
      st.update({
        course: {stata:STATA.ABSENT},
        student: {stata:STATA.ABSENT},
      });
      stataDbQuery('year',st,'year');
    },

    selectYear() {
      const el = this;
      st.update({year:{selected: el.value}});
      // st.do.fetchCourse();
    }

  }, 
}));

storeDOM({st1}, true);
st1.do.fetchYear();
st1.subscribe(d=>console.log(JSON.stringify(d.data,null,2)))


// -- HELPERS

async function stataDbQuery(table, st, stKey) {
  st.update({[stKey] : { stata:STATA.BOOTING, rows:[]}})
  console.log('booting done')
  let res = await db.query(table);
  if (res.error) 
    st.update({[stKey] : { stata:STATA.CRASH, rows:[]}})
  else
    st.update({[stKey] : { stata:STATA.DONE, rows:res.rows}})
}




import store from '#root/util/store.js';
import {stataFetch2Store, stataDone, STATA} from '#root/util/stata.js';
import db from '#root/util/fakeDB.js';

export const stYear = store(st=>({
  data : {
    stata: STATA.ABSENT,
    rows : [],
    selected: ''
  },
  calc : {
    htmlYear () {
      return stataDone(st.data.year.stata, `
        <h2>Years</h2>
        <select do="stYear.selectYear|change">
          <option value="">-</option>
          ${st.data.year.rows.map(r=>`
            <option ${(r.id_year == st.data.year.selected) && 'selected'}  
              value="${r.id_year}"
            >${r.id_year}</option>
          `).join('')}
        </select>
      `,'Error fetching years');
    }
  },
  do : {
    fetchYear() {
      return stataFetch2Store(st, db.query('year') );
    },
  }
}));




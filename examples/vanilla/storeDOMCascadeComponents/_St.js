const stYear = store(st=>({
  data : {
    rows: [],
    selected: undefined
  },
  calc : {
    html () { return 'years: ' + st.data.rows.join(',') },
  },
  do : {
    select() {
      st.data.count++;
      st.update();
    },
  }
}));
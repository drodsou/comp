
const st = {
  data : {
    stata: 0,
    rows: [],
    selected : undefined
  },
  view : {
    Select() {
      if (st.data.stata === 0)  return '';
      if (st.data.stata === 1)  return '<div class="spinner"></div>';
      if (st.data.stata === 2)  return '<div>ERROR</div>';
      if (st.data.stata === 3)  return `<div>
        ${st.data.rows.map((r,i)=>(

        )).join('');
      
      </div>`;
    }

  }
}
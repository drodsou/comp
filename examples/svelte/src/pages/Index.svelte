<script>

  let count = 0

  const increment = () => {
    count += 1
  }

</script>



  <button on:click={increment}>
    count is {count}
  </button>

  <!-- <hr>

  <ce-count props={{count}}></ce-count> -->

  <hr>

  <qp-box id="box1">
    <qp-count id="c1">C1</qp-count>
    <qp-box id="box2">
      <button>btn1</button>
      <qp-count props={{count}} id="ce2">C2</qp-count>
    </qp-box>
  </qp-box>


  


<style>
  
</style>

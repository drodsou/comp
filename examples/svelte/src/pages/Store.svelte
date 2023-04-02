<script>
/*
testing util/createStore compatibility with Svelte
*/



import createStore from '@root/util/createStore.js';
const st2 = createStore({count:0, other:2});

st2.subscribe(s=>console.log(s.data))

</script>

<button on:click={()=>st2.data = {count:st2.data.count+1}}>
  count is {$st2.data.count}
</button>

<qp-count props={$st2.data} on:change={e=>st2.data=e.detail}></qp-count>


<style>
  
</style>

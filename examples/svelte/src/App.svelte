<script>
import './App.css';
import Index from './pages/Index.svelte'
import Store from './pages/Store.svelte'

const pages = {Index, Store}

let urlPage = document.location.href.split('/').slice(-1)[0];
if (!(urlPage in pages)) urlPage = 'Index';
</script>



<nav>
  {#each Object.keys(pages) as page}
    <a href="/{page}">{page}</a>
  {/each}
</nav>

<header>{urlPage.toUpperCase()}</header>

<main>
  <svelte:component this={pages[urlPage]}/>
</main>

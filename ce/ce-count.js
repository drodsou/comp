const tag = import.meta.url.split('/').pop().split('.').shift();
customElements.define(tag, class extends HTMLElement {
  
  constructor() {
    super();
    this.mem = {
      props: {count:1}
    }
    console.log('ce-count CONSTRUCTOR');
  }

  connectedCallback() {
    if (this.mem.ready) {console.log('ce-count skipping reconnect'); return;  }

    console.log('ce-count connected 🟢');
    const props = this.mem.props;
    
    this.innerHTML = /*html*/`
      
      <button>3</button>

      <style>
        ${tag} button{
          border-radius: 20px;
          background-color: lightgreen;
          cursor: pointer;
          padding: 5px 20px;
        }
      </style>
    `;

    this.querySelector('button').addEventListener('click',()=>{
      props.count++;
      this.update()
    });

    // -- common
    this.update();
    this.mem.ready = true;
  }

  disconnectedCallback() {
      if (this.parentNode) console.log('ce-count skiping temporal disconnet');
      else console.log('ce-count disconnected 🔴');

    // todo nexttick check if parentnode (remounted) cancel disconnection
  }

  update() {
    const props = this.mem.props;
    this.querySelector('button').innerText = props.count;
    this.dispatchEvent(new CustomEvent('change',{detail: props}));  // works with onchange and Svelte on:change
    // if (this.onchange) this.onchange({detail:props})  // this does not work with on:change in Svelte
  }

  // -- common
  set props(p) {
    const props = this.mem.props;
    Object.assign(props,p);
    if (this.mem.ready) this.update();
  }

  get props() {
    const props = this.mem.props;
    return {...props}
  }
});
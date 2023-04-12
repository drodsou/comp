const tag = import.meta.url.split('/').pop().split('.').shift();
customElements.define(tag, class extends HTMLElement {
  
  constructor() {
    super();
    this.mem = {
      props: {count:1}
    }
  }

  connectedCallback() {
    const props = this.mem.props;
    this.innerHTML = /*html*/`
      <button></button>

      <style>
        ${tag} button{
          border-radius: 20px;
          background-color: lightblue;
          padding: 5px 20px;
        }
      </style>
    `;
    // -- common
    this.update();
    this.mem.ready = true;
  }

  update() {
    const props = this.mem.props;
    this.querySelector('button').innerText = props.count;
    // this.dispatchEvent(new CustomEvent('change',{detail: props}));  // works with onchange and Svelte on:change

  }

  // -- common
  set props(p) {
    Object.assign(this.mem.props,p);
    if (this.mem.ready) this.update();
  }
  get props() { return {...this.mem.props}  }
});
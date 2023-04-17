const tag = import.meta.url.split('/').pop().split('.').shift();
customElements.define(tag, class extends HTMLElement {
  
  constructor() {
    super();
    this.mem = {
      props: {
        title:'t1',
        slot:'slot1'
      }
    }
  }

  connectedCallback() {
    const props = this.mem.props;
    this.innerHTML = /*html*/`
      <h1></h1><slot></slot>

      <style>
        ${tag} {
          display: block;
          border: 1px solid grey;
          padding: 10px;
        }
      </style>
    `;
    // -- common
    console.log('slot', this.mem.props.slot);
    this.update();
    this.mem.ready = true;
  }

  update() {
    const props = this.mem.props;
    this.querySelector('h1').innerText = props.title;
    this.querySelector('slot').innerHTML = props.slot;
    // this.dispatchEvent(new CustomEvent('change',{detail: props}));  // works with onchange and Svelte on:change

  }

  

  // -- common
  set props(p) {
    Object.assign(this.mem.props,p);
    if (this.mem.ready) this.update();
  }
  get props() { return {...this.mem.props}  }
});
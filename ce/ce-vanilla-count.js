const tag = import.meta.url.split('/').pop().split('.').shift();
customElements.define(tag, class extends HTMLElement {
  
  constructor() {
    super();
    this.elPriv = {
      props: {count:1}
    }
  }
  connectedCallback() {
    const props = this.elPriv.props;
    
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
    this.elPriv.ready = true;
  }

  update() {
    const props = this.elPriv.props;
    this.querySelector('button').innerText = props.count;
    this.dispatchEvent(new CustomEvent('change',{detail: props}));  // works with onchange and Svelte on:change
    // if (this.onchange) this.onchange({detail:props})  // this does not work with on:change in Svelte
  }

  // -- common
  set props(p) {
    const props = this.elPriv.props;
    Object.assign(props,p);
    if (this.elPriv.ready) this.update();
  }

  get props() {
    const props = this.elPriv.props;
    return {...props}
  }
});
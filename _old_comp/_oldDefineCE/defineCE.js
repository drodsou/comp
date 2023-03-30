export function defineCE(tag, obj) {
  
  // if (defineCE.defined[tag]) {
  //   console.error('ERROR: defineCE',tag,'is alreadyDefined');
  //   return;
  // }
  // defineCE.defined[tag] = {}

  customElements.define(tag, class extends HTMLElement {
    constructor () {
      super();
      // const obj = objfn({$:qs=>this.querySelector(qs)})
      obj.render = obj.render || (()=>`<div></div>`);
      obj.update = obj.update || (()=>{});
      obj.mount = obj.mount || (()=>{});
      Object.assign(this, obj);

      this.state = {...this.state}
      this.setState = function (st) {
        Object.assign(this.state, st);
        this.update();
      }
      // this.id = this.getAttribute('id') || uid(tag)
      // this.id = this.id || uid(tag)

      // -- 
      // if (defineCE.defined[[this.id]]) {
      //   console.error('ERROR: defineCE id',this.id,'is alreadyDefined');
      // }
      // defineCE.defined[this.id] = this;
    }
    
    connectedCallback() {
      this.innerHTML = this.render();
      this.update(); 
      this.mount();
      this.ready = true;
    }

    // -- intentionally dont use observed attributes, to avoid props/attr sync mess
  })
};

// defineCE.defined = {};

// window.defineCE = defineCE


// function uid (prefix='') {
//   let id = Math.floor(Math.random() * Date.now()).toString(32)
//   return prefix ? (prefix + '-' + id) : id;
// }
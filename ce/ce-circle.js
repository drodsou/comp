// -- for simple CEs, just use vanilla definition

const tag = import.meta.url.split('/').pop().split('.').shift();
customElements.define(tag, class extends HTMLElement {

  constructor() {
    super();
    this.mem = {
      props: {to: 0, s: 0}
    }
  }

  connectedCallback() {
    // let cl = 'cl'+ Math.floor(Math.random() * Date.now()).toString(32)
    this.innerHTML = /*html*/`

      <svg viewbox="0 0 200 200">
        <circle class="circle" cx="100" cy="100" r="85" stroke-width="30"; fill-opacity="0" />
      </svg>

      <style>
        ${tag} {
          display: inline-block;
          width:150px;
          height:150px;
        }
        ${tag} svg {
          rotate: -90deg;
        }
        ${tag} .circle {
          stroke-dasharray: 0;
          stroke-dashoffset: 0;
          transition-duration: 0s;
          transition-property: stroke-dashoffset;
          transition-timing-function: linear;
          stroke: #017BC4;
        }
      </style>
    `;

    // -- init
    let circle = this.querySelector('.circle');
    let circleLength = circle.getTotalLength() + 1;
    circle.style.setProperty('stroke-dasharray', circleLength);
    Object.assign(this.mem, {circle, circleLength});

    // -- first update
    this.update();
    this.ready = true;
  }

  update() {
    const {circle, circleLength, props} = this.mem;
    circle.style.setProperty('transition-duration', props.s +'s');
    circle.style.setProperty('stroke-dashoffset', -circleLength * (1-props.to));
  }

  set props(p) {
    // -- si hay .from hay que hacer 2 updates seguidos, 
    // --  uno para colocar en inicio inmediatamente
    // -- y el 2o progresivamente, pero tiene que ser asincrono sino la css prop ignora la primer from
    if ('from' in p) {
      this.mem.props = {to:p.from, s:0}
      this.update()
    }
    // -- normal .to
    setTimeout(()=>{
      this.mem.props = {to:p.to, s:p.s || 0}
      if (this.ready) this.update();
    },1);
  }

  get props() {
    return {...this.mem.props};
  }


});

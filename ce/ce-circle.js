// -- for simple CEs, just use vanilla definition

const tag = import.meta.url.split('/').pop().split('.').shift();
customElements.define(tag, class extends HTMLElement {

  constructor() {
    super();
    this.mem = {pc: 1, s: 0}
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
          width:50px;
          height:50px;
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
          stroke: red;
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
    const {circle, circleLength, pc, s} = this.mem;
    circle.style.setProperty('transition-duration', s +'s');
    circle.style.setProperty('stroke-dashoffset', -circleLength * (1-pc));
  }

  set props(p) {
    this.mem.pc = p.pc || 0;
    this.mem.s = p.s || 0;
    if (this.ready) this.update();
  }

  get props() {
    const {pc, s} = this.mem || {};
    return {pc,s};
  }


});

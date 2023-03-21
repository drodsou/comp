// -- for simple CEs, just use vanilla definition

customElements.define('ce-text', class extends HTMLElement {
  connectedCallback() {
    let html = this.innerHTML.replaceAll('\n','<br>');
    this.innerHTML = html;
  }
});


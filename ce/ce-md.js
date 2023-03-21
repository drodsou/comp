// -- for simple CEs, just use vanilla definition


customElements.define('ce-md', class extends HTMLElement {
  connectedCallback() {
    let textArr = this.innerHTML.split('\n');
    let margin = textArr[1].match(/^\s*/)[0]
    let text = textArr.map(l=>l.slice(margin.length)).join('\n').trim()
    this.innerHTML = marked.parse(text);
  }
});


const tag = import.meta.url.split('/').pop().split('.').shift();
customElements.define(tag, class extends HTMLElement {
  
  connectedCallback() {
    let textArr = this.innerHTML.split('\n');
    let margin = textArr[1].match(/^\s*/)[0]
    textArr = textArr.map(l=>l.slice(margin.length))

    // -- md => html
    textArr = textArr.map(l=>{
      l = l.replace(/^#( .*)/, '<h1>$1</h1>')
      l = l.replace(/^##( .*)/, '<h2>$1</h2>')
      l = l.replace(/^###( .*)/, '<h3>$1</h3>')
      l = l.replace(/^- ( .*)/, '<li>$1</li>')
      l = l.replace(/\*([^\*]+)\*/, '<strong>$1</strong>')
      l = l.replace(/\_([^\*]+)\_/, '<u>$1</u>')
      return l;
    });

    this.innerHTML = textArr.join('<br>\n');
  }
});


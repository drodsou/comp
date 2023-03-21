// -- for simple CEs, just use vanilla definition

const icon = {
  red : '🔴',
  green : '🟢'
}

customElements.define('ce-icon', class extends HTMLElement {
  connectedCallback() {
    let iconKey = this.innerText;
    this.innerHTML = `<span style="cursor:pointer;">${icon[iconKey]}</span>`;

    this.addEventListener('click',()=>{
      iconKey = iconKey === 'green' ? 'red' : 'green';
      this.querySelector('span').innerText = icon[iconKey];
    })
  }
});


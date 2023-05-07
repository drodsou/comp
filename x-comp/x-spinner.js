const tag = import.meta.url.split('/').pop().split('.').shift();

export default function html (props) {
  return `
    <${tag}></${tag}>
  `
};

html.css = ()=>/*css*/`
  ${tag} {
    display: inline-block;
    aspect-ratio: 1;
    border-radius: 50%;
    animation: ${tag}-anim 1s linear infinite;
    border: 4px solid rgba(255, 255, 255, 0.3);
  
    height: 10px;
    border-left-color: inherit;
  
  }
  
  @keyframes ${tag}-anim {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg);  }
  }
`;

// -- common
try {
 document.querySelector('head').insertAdjacentHTML('afterbegin',`<style>${html.css()}</style>`)
} catch (e) {}


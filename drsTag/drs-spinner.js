import drsTag from './drsTag.js';
export default drsTag( import.meta.url, {

  css : ()=>/*css*/`

  $T$ {
    display: inline-block;
    aspect-ratio: 1;
    border-radius: 50%;
    animation: $T$-anim 1s linear infinite;
    border: 4px solid rgba(255, 255, 255, 0.3);
  
    height: 10px;
    border-left-color: inherit;
  
  }
  
  @keyframes $T$-anim {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg);  }
  }
  `
})




import qomp from '../qomp/qomp.js';

export default qomp(import.meta.url, {
  css: ({tag}) => /*css*/`
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
  `
});
import mivan from '../../mivan.js';

let F = mivan.file(import.meta.url);
const {span} = mivan.tags;

export default function () {
  return span({class:F})
}

mivan.styles.push(`
  .${F} {
    display: inline-block;
    aspect-ratio: 1;
    border-radius: 50%;
    animation: ${F}-anim 1s linear infinite;
    border: 4px solid rgba(255, 255, 255, 0.3);

    height: 10px;
    border-left-color: inherit;

  }

  @keyframes ${F}-anim {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg);  }
  }

`)




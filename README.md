# new

Forget all use defineCE2

TODO
- ce-box style disappear in svelte, why?


# defineCE2 features

Compatible with:

- No build index.html client only
- Svelte, with auto props (even with children/innerHTML)
- SSR+hydration (.render in server + .define in client)
  - automatic server to client props passed via data-props base64-json
- React via wc-react (https://github.com/nmetulev/wc-react) see example below

Features
- style only inyected in first instance of the tag, if several instances of a tag are created.
  - or style: true create links of .css with same name of component .js
- data-props="client-rendered" prevents client re-render in nested CEs
  - (so, never use data-props on client-side only, its an automatic attriute only)

# if this lookss too complicated for the job:

If you just need a simple client side webcomponent (without nesting), that even works with Svelte 'props'

```js
see example: ce-vanille-counter.js
```

# why not just plain text and skip all the web components mess?

- E.g: with plain text html, in Svelte there is no space between "mounts the element" and y "looks if it has .props property". onMount is too late and main.js is too soon, it does not exist in the DOM yet

- mount comes by default, no need of manual mount

# use in React

```js
// --- defineAndWrapCE.js
import {wrapWc} from 'wc-react';  // magic here

import './ce-count.js';
// ... all your ce's here

import defineCE from './defineCE2.js';
defineCE.defineAll();

const ceReact = {}
defineCE.defined.forEach(tagDef=>{
  let camelName = tagDef.tagName.split('-').map(e=>e[0].toUpperCase() + e.slice(1)).join('');
  ceReact[camelName] = wrapWc(tagDef.tagName);
});
export default ceReact;




// -- use them
import ce from './defineAndWrapCE.js';
const {CeCount} = ce;

function App() {
  const [count, setCount] = useState(0)
  const ceRef = useRef();
  return (
    ...
    <CeCount ref={ceRef} props={{count}} onChange={e=>console.log(e.detail)}></CeCount>
    ... 
  )
}
```


# improvements for the future (?):

## declarative shadow root + slot (crome 111 on)

```html
  <menu-toggle>
    <template shadowrootmode="open">
      <button part="thebutton">
        <slot></slot>
      </button>
      <style>button {color:red} </style>
    </template>
    Open Menu
  </menu-toggle>
```
https://caniuse.com/?search=shadowRootmode



## css ::part

 ce-comp::part(thebutton) {color:yellow;}

## nested css

de-boilerplate element css when using external .css, not having to repeat the tags name n times.



----------- OLD

# comp 

Minimal no-build javascript component system.

Example project, with base library in comp/comp.js (1.5kb, 0.6kb compressed)

Aimed for simple projects with few components in a no-build scenario.

More convenient than custom elements, bypassing CEs cumbersome definition, lack of to-string rendering, props/attributes mess, etc. And with all the custom control you may need.

## styling 

- See CounterBox.js on optional 'linkCss()' usage (creates link:rel of compoment css). Just a normal css link, no css scoping magic, but at least css dependency is kept on the component itself, instead of needing additional css @import, so if a component is added/removed its css will be as well automatically.

- For scoping, a suggestion: since Chrome 112 css nesting is available:

```css
.counter-box {
  & button { ... }
  ...
}
```



# new

Forget all use qomp (defineCE2)

TODO
- examples ssr, vanilla, react, vue
- ui components time (md min, more)
- lifecycle willMount...

# qomp 

Main features

- Webcomponentes without shadow root, SSR+hydration capable
- Minimal, explicit, no hidden magic, simple enough to be understandable and owned by the user, future proof, no dependencies on library changes in the future
- No classes and no bizarre hooks
- < 1kb gziped, really, as is, no build needed to strip it out.
- Cross framework: use it alone, with Svelte, React, Vue, in the server...
- Not intended for maximun, speed, eficiency, state-of-the-art engineering... but for long lasting developer experience and stability, control and future proof. Just cross-framework, debugable, tinkerable base for making components you could still use in 10 or 20 years.

- grouped styles with defineAll, not a 'style' inside each ce,
- styles scoped with ${tag}
- auto css link with just "css:true" in tag definition

Compatible with:

- SSR+hydration (.render in server + .define in client)
  - automatic server to client props passed via data-props base64-json
- No build index.html
- Svelte, with auto props (even with children/innerHTML)
- React via wc-react (https://github.com/nmetulev/wc-react) see example below
- Vue, tested :props and @change, see info bellow

Done (other features)
- style only inyected in first instance of the tag, if several instances of a tag are created.
  - or style: true create links of .css with same name of component .js
- data-props="client-rendered" prevents client re-render in nested CEs
  - (so, never use data-props on client-side only, its an automatic attriute only)
- event listeners automated with 'events', auto add on mount and remove on dom dismount
  - also prevent add listener to elements alredy not in DOM, eg rerendered nested elements
- update 'set' syntax sugar
- `<slot>` instead of $slot in render: preserve already rendered nested child elements (appendChild) instead of multiple rerender of all 
- svelte nested working well too

# if this lookss too complicated for the job:

If you just need a simple client side webcomponent (without nesting), that even works with Svelte 'props'

```js
see example: ce-vanille-counter.js
```

# why not just plain text and skip all the web components mess?

- E.g: with plain text html, in Svelte there is no space between "mounts the element" and y "looks if it has .props property". onMount is too late and main.js is too soon, it does not exist in the DOM yet

- mount comes by default, no need of manual mount

# use in Vue

```js
 <ce-vanilla-count :props="{count}" @change="handleChange"></ce-vanilla-count>
```

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

# reflections

## mutable props + update, not props setter/setState

- do.action receives private props in 'this', plain objecte, modificable multiple times, sync, without reupdates, until you intentionally call update(), so you can do multiple operations in the state/props until commited with update()

```js
  const {props, update} = this;
  props.count++;
  ...whatever
  update()
```
- if received elDom.props, setter with autoupdate its less convenient

```js
  this.props = {count: this.props++}  // cannot destructure props, as its a setter
  // or
  const p = this.props;
  p.count++;
  this.props = p;   // same as update() but less intelligible.
  // update alread happened
```

## why not avoiding .update() and diff render

overcomplicated and prone to erroros in edge cases, with update() you specify exactly what happens on the update (maybe a change in content, maybe a calculated change of classes, etc
And with the $ helper is minimal extra code on the component preventing bloat and unintelligibility of the lib.


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

when nested css is available in all browsers, maybe skip the style element injection and rely only on css links?
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



qp





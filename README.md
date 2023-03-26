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

Features
- style only inyected in first instance of the tag, if several instances of a tag are created.
- data-props="client-rendered" prevents client re-render in nested CEs
  - (so, never use data-props on client-side only, its an automatic attriute only)

# if this is too complicated

If you just need a simple client side webcomponent (without nesting), that even works with Svelte 'props'

```js
see example: ce-vanille-counter.js
```



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



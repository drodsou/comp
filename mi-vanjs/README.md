# mivan
A van.js like, but simpler and state agnostic

# TODO

- aclarar hydrate render en browser, ssr, y svelte
- svelte interop, 
  - @html + $: mivan.update(st) works, but, what if several components? possible to auto attach events, or at least one .render for all mivan comps ??
  - link from each component to mivan, to not having to imprt it explicitly
  - add reactive props on mount, ce style ?
- better name
- uid remember last, prevent the odd chance 2 uid ??
- ssr => data tag with json, eg initial state
- component converter to svelte, eg

# DONE
- mivan2, global dyn, global css, svelte interop (not recommended)
- ssr getCSS 
- auto .map.join in dyn updates (str, str[], obj.html, obj.html[])
- hydrate
- all tags
- autoclosing tags
- css: mivan.styles/links
- custom element interop
```js
  '<ce-icon>red</ce-icon>',
  mivan.createTag('ce-icon')({},'green'
```

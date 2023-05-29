# mivan
A van.js like, but simpler and state agnostic

# TODO

- svelte interop, 
  - link from each component to mivan, to not having to imprt it explicitly
  - add reactive props on mount, ce style ?
- better name
- uid remember last, prevent the odd chance 2 uid ??
- ssr => data tag with json, eg initial state
- component converter to svelte, eg

# DONE
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

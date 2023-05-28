# mivan
A van.js like, but simpler and state agnostic

# TODO

- better name

- ssr => data tag with json, eg initial state

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

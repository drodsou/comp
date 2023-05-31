# mivan
A van.js like, but simpler and state agnostic

# TODO

- better name than mivan
- ssr => data tag with json, eg initial state
- component converter to svelte, eg
- svelte interop, 
  - add reactive props on mount, ce style ?

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
  tag('ce-icon',{},'green')
```
svelte: use mivan.render on onMount(), div id=#mivan, $: mivan.update(st)
  - tambien {@html c}, pero no {@html C()}, pues lo recrea
  - tampoco funcionan los link css, hacer import css adicional en svelte (los style si funcionan)


# STEPS CSR / SSR / Svelte

CLI                                 SSR                SVELTE
                                    ssrInst
                                    ssrGetHtml
                                    ssrGetCss
                                    ssrAddHtmlUiid
                                    ...
                                    readHtmlUuid 
instantiate C(): dyn, uuids, css    cliInst            cliInst (code)
addcss                                                 addcss (opc, no si links)
mount                                                   (mount (html))
addevents                           addevents          addevents







# qomp and other libs

TODO: storeDOM
  "st1.stata|$visible|booting", explorar esto
  - definidos extra en la store, los computed o algo distinto
  - en storeDom algo generico de addclass

storedom: que elimine tb los eventlisteners


see qomp readme in qomp/


# CHANGELOG

- storeDom $specialTarget
- storedom cascade, stataFetch2Store
- store update('path.to', {}), appart from free st.data.whatever; update();
- store mutable
  - not update({count:1}) as it looks cool at first but scales badly on deep objects
- storeDOM els Map, auto remove dead elements, and auto allow dynamic bindings

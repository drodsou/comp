# qomp and other libs

TODO: storeDOM
- rename: calc => view, do => action?, data=>model ?   model-view-action?
- storedom: que elimine tb los eventlisteners

see qomp readme in qomp/

# architecture

Model => View (plain data or calc) => Action <==> Service (+Business logic, +storage/infra) 
                                              => Model

# CHANGELOG


- storeDom calc returning undefined as custom view transformer  "st.calc1||arg1" for arbitrary transformations
- storeDom special target visible, hidden, addClass, removeClass
- storeDom $specialTarget
- storedom cascade, stataFetch2Store
- store update('path.to', {}), appart from free st.data.whatever; update();
- store mutable
  - not update({count:1}) as it looks cool at first but scales badly on deep objects
- storeDOM els Map, auto remove dead elements, and auto allow dynamic bindings

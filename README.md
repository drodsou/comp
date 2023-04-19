# qomp and other libs

TODO: qpm-table
- confirmar que no-slot es the way to go.


- rename: calc => view, do => action?, data=>model ?   model-view-action?
- storedom: que elimine tb los eventlisteners

see qomp readme in qomp/

# architecture

really:
 - Store: Model and Calc | Action | Subscriptions
 - View (html), may be update by subscritptions, listen events that trigger store Actions
   - StoreDom (viewcontroller, one subscription to all view bindings)
 - Services (consulted by actions before updating model) business logic, infra, etc           
 
                                     

# CHANGELOG


- storeDom calc returning undefined as custom view transformer  "st.calc1||arg1" for arbitrary transformations
- storeDom special target visible, hidden, addClass, removeClass
- storeDom $specialTarget
- storedom cascade, stataFetch2Store
- store update('path.to', {}), appart from free st.data.whatever; update();
- store mutable
  - not update({count:1}) as it looks cool at first but scales badly on deep objects
- storeDOM els Map, auto remove dead elements, and auto allow dynamic bindings

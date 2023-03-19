/**
 * Main funcion for component definition
*/
export function comp ({render, update, state={}}){
    
  function create(compId, compState={}) {

    // -- $ component querySelector, $() = component's dom element
    // const el = (qs) => $(qs, document.getElementById(compId));
    const el = (qs) => $(qs, document.getElementById(compId));
    const _state = {...state, ...compState}

    // -- component's .render() + extras
    const _render = () => {
      return render({state:_state}).trim()
        .replace(/(^<[^\s^>]+)/,'$1 id="' + compId + '"');
    };

    // -- component's .update() + extras
    const _update = (updateState={}) => {
      Object.assign(_state, updateState);
      update({state:_state, el}); 
      _state._initialized = true;
    }

    return {el, render: _render, update: _update, state: _state, id: compId}
  }

  return create;
}


/**
 * Helper comp funcion: finds <comp>compIdX</comp> in the html and replaces by .render() of passed components
 * example: const comps = compRender([Counter('counter1'), ... ])
 * returns object of successfull substituted components.
*/
export function compMount(compArr) {
  const compObj = {}
  compArr.filter(e=>e).forEach(comp=>{
    let compEl = document.getElementById(comp.id);
    if (!compEl) {
      console.error('Not found <comp id="'+comp.id+'"></comp> in the html');
    } else {
      compEl.outerHTML = comp.render();
      comp.update(); // first auto update
      compObj[comp.id] = comp;
    }
  })
  return compObj;
}

// -- HELPERS: 
export function linkCss(jsUrl) {
  const linkEl = document.createElement("link");
  linkEl.setAttribute("rel", "stylesheet");
  linkEl.setAttribute("href", jsUrl.replace('.js','.css'));
  document.head.append(linkEl);
}

export function $(qs, base=document) {
  if (!qs) return base;
  let els = [...base.querySelectorAll(qs)]
  return els.length > 1 ? els : els[0]

}





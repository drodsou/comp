/**
 * Main funcion for component definition
*/
export function comp ({render, update, state}){
  render = render || (()=>`<div></div>`);
  update = update || (()=>{});
  const defaultState = state || {}

  function create(compId, createState={}) {

    // -- $ component querySelector, $() = component's dom element
    const el = (qs) => $(qs, document.getElementById(compId));
    const _state = {...defaultState, ...createState}

    // -- component's wrapped .render() -adds id to first html element
    const _render = (renderState={}) => {
      Object.assign(_state, renderState);
      return render({state:_state}).trim()
        .replace(/(^<[^\s^>]+)/,'$1 id="' + compId + '"');
    };

    // -- component's wrapped .update()
    const _update = (updateState={}) => {
      Object.assign(_state, updateState);
      update({state:_state, el}); 
      _state._updated = true;
    }

    return {el, render: _render, update: _update, state: _state, id: compId, mount}
  }

  return create;
}


// ------------- HELPERS

/**
 * Helper used by 'comp', and can be used independently
 * convenient mix of querySelector and querySelectorAll
*/
export function $(qs, base=document) {
  if (!qs) return base;
  let els = [...base.querySelectorAll(qs)]
  return els.length > 1 ? els : els[0]
}

/**
 * Helper used by 'comp' (not essential): 
 * finds <comp id="compId"></comp> in the html and replaces by .render() of the component
*/
function mount() {
  try {
    document.getElementById(this.id).outerHTML = this.render();
    this.update();
    return this;
  } catch (e) {
    console.error('Not found id="'+this.id+'" in the html');
    return false;
  }
}


/**
 * Helper, independent of 'comp': Multiple mounts, returns object of successfull substituted components.
 * example: const comps = compRender([Counter('counter1'), ... ])
 * 
*/
export function compMount(compArr) {
  const compObj = {}
  compArr.filter(e=>e).forEach(comp=>{
    if (comp.mount()) compObj[comp.id] = comp; 
  })
  return compObj;
}



// --helper, independent of 'comp'
export function linkCss(jsUrl) {
  const linkEl = document.createElement("link");
  linkEl.setAttribute("rel", "stylesheet");
  linkEl.setAttribute("href", jsUrl.replace('.js','.css'));
  document.head.append(linkEl);
}





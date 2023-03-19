/**
 * Main funcion for component definition
*/
export function comp ({render, update, state={}}){
    
  function create(compId, compState={}) {

    // -- $ component querySelector, $() = component's dom element
    const $ = (qs) => qs 
      ? document.getElementById(compId).querySelector(qs)
      : document.getElementById(compId);
    const _state = {...state, ...compState}

    // -- component's .render() + extras
    const _render = () => {
      return render({state:_state}).trim()
        .replace(/(^<[^\s^>]+)/,'$1 id="' + compId + '"');
    };

    // -- component's .update() + extras
    const _update = (updateState={}) => {
      Object.assign(_state, updateState);
      update({state:_state, $}); 
      _state._initialized = true;
    }

    return {$, render: _render, update: _update, state: _state, id: compId}
  }

  return create;
}


/**
 * Helper funcion: finds <comp>compIdX</comp> in the html and replaces by .render() of passed components
 * example: const comps = compRender([Counter('counter1'), ... ])
 * returns object of successfull substituted components.
*/
export function compReplace(compArr) {
  const compObj = {}
  const compEls = [...document.querySelectorAll('comp')]
  compArr.filter(e=>e).forEach(c=>{
    let compEl = compEls.filter(cEl=>cEl.innerText === c.id)[0];
    if (!compEl) {
      console.error('Not found <comp>'+c.id+'</comp> in the html');
    } else {
      compEl.outerHTML = c.render();
      c.update(); // first auto update
      compObj[c.id] = c;
    }
  });
  return compObj;
}


export function linkCss(jsUrl) {
  const linkEl = document.createElement("link");
  linkEl.setAttribute("rel", "stylesheet");
  linkEl.setAttribute("href", jsUrl.replace('.js','.css'));
  document.head.append(linkEl);
}





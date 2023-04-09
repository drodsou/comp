export default function objPath (baseObj, path='') {
  const pathArr =  (typeof path === 'string' ? path.split('.') : [...path])
  const key = pathArr.pop();
  const obj = pathArr.length === 0 ? baseObj : pathArr.reduce((prevObj, currKey) => prevObj[currKey], baseObj);
  if (!obj || (key && !(key in obj))) { 
    throw new Error(`qomp: objPath: path "${path}" not found in object { ${Object.keys(baseObj).join(',')} }`) 
  }
  return { 
    get: ()=>key ? obj[key] : obj, 
    set:(v)=>{ 
      if (!key) { throw new Error('objPath: cannot set value on empty path'); }
      obj[key] = v;
    }
  }
};
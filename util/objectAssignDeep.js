// -- https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge

export function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

export default  function objAssignDeep(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        objAssignDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return objAssignDeep(target, ...sources);
}
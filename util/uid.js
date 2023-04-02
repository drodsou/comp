export default function uid (prefix='') {
  let id = Math.floor(Math.random() * Date.now()).toString(32)
  return prefix ? (prefix + '-' + id) : id;
}
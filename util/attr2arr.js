export default function attr2arr (str) {
  if (!str) return [];
  return str.split(';').map(a=>a.trim()).filter(a=>a.length)
   .map(a=>a.replace(/(^\||\|$)/g,'').split('|').map(b=>b.trim()))
}
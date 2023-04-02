
export default function qs(q) {
  let els = document.querySelectorAll(q);
  return els.length > 1 ? els : els[0]
}
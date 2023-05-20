
function tagdef(tagname, {html, query}) {
  let tag = function (htmlProps) {
    return html(htmlProps)
  }
  tag.query = query;

  return tag;
}
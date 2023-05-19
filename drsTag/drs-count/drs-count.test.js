import tag from './drs-count.js';

console.log(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Document</title>
    ${tag.css() /* if this removed, style goes in first element*/}
  </head>
  <body>
    ${tag()}
    ${tag()}
  </body>
  </html>
`)
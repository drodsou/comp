import drsSpinner from './drs-spinner.js';

console.log(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Document</title>
    ${drsSpinner.css() /* if this removed, style goes in first element*/}
  </head>
  <body>
    ${drsSpinner()}
    ${drsSpinner()}
  </body>
  </html>
`)
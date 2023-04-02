esbuild --bundle qomp.js --minify --pure:console.log --outfile=dist/qomp.min.js
brotli -c dist/qomp.min.js > dist/qomp.min.br 
gzip -c dist/qomp.min.js > dist/qomp.min.gz
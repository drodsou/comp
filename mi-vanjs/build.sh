esbuild --bundle mivan.js --minify --pure:console.log --outfile=dist/mivan.min.js
brotli -c dist/mivan.min.js > dist/mivan.min.br 
gzip -c dist/mivan.min.js > dist/mivan.min.gz
ls -l dist
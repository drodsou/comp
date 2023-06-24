esbuild --bundle pezas.js --minify --pure:console.log --outfile=dist/pezas.min.js
brotli -c dist/pezas.min.js > dist/pezas.min.br 
gzip -c dist/pezas.min.js > dist/pezas.min.gz
ls -l dist
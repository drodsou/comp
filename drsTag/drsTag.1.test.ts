import type {Tag} from './drsTag.js';

import drsTag from './drsTag.js';

let b: Tag<{count:number}, {key:number},{}> 
  = drsTag(import.meta.url, {
      html: ({count})=>'html ' + count
  });
console.log(b());
b.query({key:'no'})    // error should be here, id_edicion is number
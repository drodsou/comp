type Head1<T> = (arr: T[]) => T;
type Head2 = <T> (arr: T[]) => T;


const head1 : Head1<number> = function (arr) {
  let a     
  a = arr[0]
  return a
}

let h1 =  head1(["a","b"]); // error


const head2 : Head2 = function (arr) {
  let a     
  a = arr[0]
  return a
}

let h2 = head2([2,1]);
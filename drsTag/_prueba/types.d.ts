export type Head <T> = (arr: T[]) => T;

function ({uno} : {uno:number}) : string  {}
    

function fn ({uno=1} = {}) {
  return ' ' + uno
}


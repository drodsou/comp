export default function (props: {
  [p: string]: any;
  id?: string | undefined;
  class?: string | undefined;
  rows: Object[];
  cols: {id:string, label?:string}[];
  key: string;
  selectedKey?: string;
}) : string;

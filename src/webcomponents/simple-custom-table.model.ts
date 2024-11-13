export type TableElement = HTMLElement | DocumentFragment;

export interface SimpleCustomTableItem {
  id: string;
  [k: string]: unknown;
}

export interface SimpleCustomTableColumn {
  prop: string;
  header?: string;

  renderHeader?: () => TableElement;
  updateHeader?: (cell: TableElement) => void;
  removeHeader?: (cell: TableElement) => void;

  renderCell?: (props: SimpleCustomTableItem, rowIndex: number) => TableElement;
  updateCell?: (props: SimpleCustomTableItem, rowIndex: number, cell: TableElement) => void;
  removeCell?: (cell: TableElement) => void;
}

export interface SimpleCustomTableProps {
  columns: SimpleCustomTableColumn[];
  data: SimpleCustomTableItem[];
}

interface TableDOMCell {
  prop: string;
  $: TableElement;
}

interface TableDOMRow {
  id: string;
  $: TableElement;
  cells: TableDOMCell[];
}

export interface TableDOM {
  headers: TableDOMCell[];
  rows: TableDOMRow[];
}

export interface SimpleCustomTableItem {
  [k: string]: unknown;
}

type TableElement = HTMLElement | DocumentFragment;

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

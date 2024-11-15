import type { SimpleCustomTableColumn, SimpleCustomTableItem } from '../simple-custom-table.model';
import {
  createTableCell,
  createTableHeader,
  destroyTableCell,
  destroyTableHeader,
  updateTableCell,
  updateTableHeader,
} from './dom-table-utils';
import { insertChildAtIndex } from './insert-child-at-index';

type TableElement = HTMLElement | DocumentFragment;
type WithContainer<T> = T & { $: TableElement };
type TableDOMCell = WithContainer<{ prop: string }>;
type TableDOMRow = WithContainer<{ id: string; cells: TableDOMCell[] }>;

export class TableDOM {
  public readonly headersContainer = document.createElement('tr');
  public readonly rowsContainer = document.createElement('tbody');
  #headers: TableDOMCell[] = [];
  #rows: TableDOMRow[] = [];

  private getHeader(prop: string) {
    return this.#headers.find((header) => header.prop === prop);
  }

  private getRow(id: string) {
    return this.#rows.find((row) => row.id === id);
  }

  // Header cells

  private addHeaderCellAt(column: SimpleCustomTableColumn, index: number) {
    const $th = createTableHeader(column);
    this.#headers.splice(index, 0, {
      prop: column.prop,
      $: $th,
    });
    insertChildAtIndex(this.headersContainer, $th, index);
  }

  private updateHeaderCell(column: SimpleCustomTableColumn) {
    const header = this.getHeader(column.prop)!;
    updateTableHeader(header.$, column);
  }

  private removeHeaderCell(column: SimpleCustomTableColumn) {
    const header = this.getHeader(column.prop)!;
    this.#headers.splice(this.#headers.indexOf(header), 1);
    destroyTableHeader(header.$, column);
  }

  // Row cells

  private addRowCellAt(
    column: SimpleCustomTableColumn,
    columnIndex: number,
    item: SimpleCustomTableItem,
    itemIndex: number
  ) {
    const row = this.getRow(item.id)!;
    const $td = createTableCell(column, itemIndex, item);
    insertChildAtIndex(row.$, $td, columnIndex);

    row.cells.splice(columnIndex, 0, {
      prop: column.prop,
      $: $td,
    });
  }

  private updateRowCell(column: SimpleCustomTableColumn, item: SimpleCustomTableItem, itemIndex: number) {
    const row = this.getRow(item.id)!;
    const cell = row.cells.find((cell) => cell.prop === column.prop)!;
    updateTableCell(cell.$, column, item, itemIndex);
  }

  private removeRowCell(column: SimpleCustomTableColumn, id: string) {
    const row = this.getRow(id)!;
    const cellIndex = row.cells.findIndex((cell) => cell.prop === column.prop);
    const cell = row.cells[cellIndex];
    destroyTableCell(cell.$, column);
    row.cells.splice(cellIndex, 1);
  }

  // Rows

  public addRow(columns: SimpleCustomTableColumn[], item: SimpleCustomTableItem, itemIndex: number) {
    const $tr = document.createElement('tr');
    insertChildAtIndex(this.rowsContainer!, $tr, itemIndex);

    this.#rows.splice(itemIndex, 0, {
      id: item.id,
      $: $tr,
      cells: [],
    });

    columns.forEach((column, columnIndex) => {
      this.addRowCellAt(column, columnIndex, item, itemIndex);
    });
  }

  public updateRow(columns: SimpleCustomTableColumn[], item: SimpleCustomTableItem, itemIndex: number) {
    const row = this.getRow(item.id)!;
    row.cells.forEach((cell) => {
      const column = columns.find((column) => column.prop === cell.prop)!;
      this.updateRowCell(column, item, itemIndex);
    });
  }

  public removeRow(columns: SimpleCustomTableColumn[], id: string) {
    const row = this.getRow(id)!;
    const rowIndex = this.#rows.indexOf(row);
    row.cells.forEach((cell) => {
      const column = columns.find(({ prop }) => prop === cell.prop)!;
      this.removeRowCell(column, id);
    });
    this.#rows.splice(rowIndex, 1);
    this.rowsContainer.removeChild(row.$);
  }

  // Headers

  public addHeader(column: SimpleCustomTableColumn, index: number, data: SimpleCustomTableItem[]) {
    this.addHeaderCellAt(column, index);
    for (const row of this.#rows) {
      const itemIndex = data.findIndex(({ id }) => id === row.id);
      const item = data[itemIndex];
      this.addRowCellAt(column, index, item, itemIndex);
    }
  }

  public updateHeader(column: SimpleCustomTableColumn, reloadRowCells: boolean, data: SimpleCustomTableItem[]) {
    this.updateHeaderCell(column);
    if (!reloadRowCells) return;
    for (const row of this.#rows) {
      const columnIndex = row.cells.findIndex((cell) => cell.prop === column.prop);
      this.removeRowCell(column, row.id);
      const itemIndex = data.findIndex((item) => item.id === row.id);
      const item = data[itemIndex];
      this.addRowCellAt(column, columnIndex, item, itemIndex);
    }
  }

  public removeHeader(column: SimpleCustomTableColumn) {
    this.removeHeaderCell(column);
    for (const row of this.#rows) {
      this.removeRowCell(column, row.id);
    }
  }
}

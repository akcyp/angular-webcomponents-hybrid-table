import type {
  SimpleCustomTableColumn,
  SimpleCustomTableItem,
  SimpleCustomTableProps,
  TableDOM,
} from './simple-custom-table.model';

import { diffArrayOfObject } from './utils/diff';
import {
  createTableCell,
  createTableHeader,
  destroyTableCell,
  destroyTableHeader,
  updateTableCell,
  updateTableHeader,
} from './utils/dom-table-utils';
import { insertChildAtIndex } from './utils/insert-child-at-index';

export class SimpleCustomTable extends HTMLElement {
  #shadow: ShadowRoot;
  #columnsContainer?: HTMLTableRowElement;
  #dataRowsContainer?: HTMLTableSectionElement;
  #props: SimpleCustomTableProps = {
    columns: [],
    data: [],
  };

  #dom: TableDOM = {
    headers: [],
    rows: [],
  };

  private updateColumns(oldColumns: SimpleCustomTableColumn[], newColumns: SimpleCustomTableColumn[]) {
    const diff = diffArrayOfObject('prop', oldColumns, newColumns);

    diff.removed.forEach(({ ref, value }) => {
      const index = this.#dom.headers.findIndex((header) => header.prop === ref);
      const header = this.#dom.headers[index];
      destroyTableHeader(header.$, value);
      this.#dom.headers.splice(index, 1);
      this.#columnsContainer?.removeChild(header.$);

      this.#dom.rows.forEach((row) => {
        row.cells;
      });
    });

    diff.updated.forEach(({ ref, value }) => {
      const index = this.#dom.headers.findIndex((header) => header.prop === ref);
      const header = this.#dom.headers[index];
      updateTableHeader(header.$, value);
    });

    diff.added.forEach(({ ref, index, value }) => {
      const $th = createTableHeader(value);
      this.#dom.headers.splice(index, 0, {
        prop: ref,
        $: $th,
      });
      insertChildAtIndex(this.#columnsContainer!, $th, index);
      // Call updates
      updateTableHeader($th, value);
    });

    // TODO: update table rows after columns update
  }

  private updateRows(oldRows: SimpleCustomTableItem[], newRows: SimpleCustomTableItem[]) {
    const diff = diffArrayOfObject('id', oldRows, newRows);

    diff.removed.forEach(({ ref }) => {
      const index = this.#dom.rows.findIndex((row) => row.id === ref);
      const row = this.#dom.rows[index];
      row.cells.forEach((cell) => {
        const column = this.#props.columns.find((column) => column.prop === cell.prop)!;
        destroyTableCell(cell.$, column);
      });
      this.#dom.rows.splice(index, 1);
      this.#dataRowsContainer?.removeChild(row.$);
    });

    diff.updated.forEach(({ ref, value, index: rowIndex }) => {
      const index = this.#dom.rows.findIndex((row) => row.id === ref);
      const row = this.#dom.rows[index];
      row.cells.forEach((cell) => {
        const column = this.#props.columns.find((column) => column.prop === cell.prop)!;
        updateTableCell(cell.$, column, value, rowIndex);
      });
    });

    diff.added.forEach(({ ref, index, value }) => {
      const $tr = document.createElement('tr');
      insertChildAtIndex(this.#dataRowsContainer!, $tr, index);

      const cells = this.#props.columns.map((column) => {
        const $td = createTableCell(column, index, value);
        $tr.appendChild($td);
        // call update
        updateTableCell($td, column, value, index);
        return {
          prop: column.prop,
          $: $td,
        };
      });

      this.#dom.rows.splice(index, 0, {
        id: ref,
        $: $tr,
        cells,
      });
    });
  }

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const style = document.createElement('style');
    style.innerHTML = `
      table {
        border-collapse: collapse;
      }
      table td, table th {
        border: 1px solid #ddd;
        padding: 8px;
      }
      table tr:nth-child(even){
        background-color: #f2f2f2;
      }
      table tr:hover {
        background-color: #ddd;
      }
      table th {
        padding-top: 12px;
        padding-bottom: 12px;
        text-align: left;
      }
    `;
    this.#shadow.appendChild(style);

    const $table = document.createElement('table');
    const $thead = document.createElement('thead');
    const $tbody = document.createElement('tbody');

    $table.appendChild($thead);
    $table.appendChild($tbody);
    this.#shadow.appendChild($table);

    this.#dataRowsContainer = $tbody;
    this.#columnsContainer = document.createElement('tr');
    $thead.appendChild(this.#columnsContainer);
  }

  // Biding attrs

  get columns() {
    return this.#props.columns;
  }

  set columns(value: SimpleCustomTableColumn[]) {
    this.updateColumns(this.#props.columns, value);
    this.#props.columns = value;
    this.updateRows([], this.#props.data);
  }

  get data() {
    return this.#props.data;
  }

  set data(value: SimpleCustomTableItem[]) {
    if (this.columns.length) {
      this.updateRows(this.#props.data, value);
    }
    this.#props.data = value;
  }
}

customElements.define('simple-custom-table', SimpleCustomTable);

import { SimpleCustomTableColumn, SimpleCustomTableItem, SimpleCustomTableProps } from './simple-custom-table.model';

import { diffArrayOfObject } from './utils/diff';
import { TableDOM } from './utils/dom-table';

export class SimpleCustomTable extends HTMLElement {
  #shadow: ShadowRoot;
  #props: SimpleCustomTableProps = {
    columns: [],
    data: [],
  };

  #table = new TableDOM();

  private updateColumns(oldColumns: SimpleCustomTableColumn[], newColumns: SimpleCustomTableColumn[]) {
    const diff = diffArrayOfObject('prop', oldColumns, newColumns);

    diff.removed.forEach(({ value: column }) => {
      this.#table.removeHeader(column);
    });

    diff.updated.forEach(({ value: column, updates }) => {
      const shouldForceUpadeRows = updates.some((update) =>
        ['renderCell', 'updateCell', 'removeCell'].includes(update?.prop ?? '')
      );
      this.#table.updateHeader(column, shouldForceUpadeRows, this.data);
    });

    diff.added.forEach(({ index, value: column }) => {
      this.#table.addHeader(column, index, this.data);
    });
  }

  private updateRows(oldRows: SimpleCustomTableItem[], newRows: SimpleCustomTableItem[]) {
    const diff = diffArrayOfObject('id', oldRows, newRows);

    diff.removed.forEach(({ ref }) => {
      this.#table.removeRow(this.columns, ref);
    });

    diff.updated.forEach(({ value, index }) => {
      this.#table.updateRow(this.columns, value, index);
    });

    diff.added.forEach(({ value, index }) => {
      this.#table.addRow(this.columns, value, index);
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
    $table.appendChild(this.#table.rowsContainer);
    const $thead = document.createElement('thead');
    $thead.appendChild(this.#table.headersContainer);
    $table.appendChild($thead);
    this.#shadow.appendChild($table);
  }

  // Biding attrs

  get columns() {
    return this.#props.columns;
  }

  set columns(value: SimpleCustomTableColumn[]) {
    this.updateColumns(this.#props.columns, value);
    this.#props.columns = value;
  }

  get data() {
    return this.#props.data;
  }

  set data(value: SimpleCustomTableItem[]) {
    this.updateRows(this.#props.data, value);
    this.#props.data = value;
  }
}

customElements.define('simple-custom-table', SimpleCustomTable);

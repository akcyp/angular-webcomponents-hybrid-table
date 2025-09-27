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
        min-width: 100%;
        background-color: #ffffff;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        border-radius: 0.5rem;
        overflow: hidden;
        border: 1px solid #d1d5db;
      }

      table thead {
        background-color: #f3f4f6;
      }

      table th {
        padding: 0.75rem 1.5rem;
        text-align: left;
        font-size: 0.875rem;
        font-weight: 600;
        color: #111827;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      table tbody tr {
        transition: background-color 0.2s ease, color 0.2s ease;
      }

      table tbody tr:hover {
        background-color: #f9fafb;
        color: #1e40af;
      }

      table tbody tr:nth-child(even) {
        background-color: #f9fafb;
      }

      table td {
        padding: 1rem 1.5rem;
        white-space: nowrap;
        font-size: 0.875rem;
        color: #374151;
        border-bottom: 1px solid #e5e7eb;
      }

      table th,
      table td {
        border: 1px solid #d1d5db;
      }

      /* Responsive tables */
      @media (max-width: 640px) {
        table {
          display: block;
          overflow-x: auto;
        }
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

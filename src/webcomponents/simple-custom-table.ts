import { createElementWithContent } from './simple-custom-table.utils';

import type {
  SimpleCustomTableColumn,
  SimpleCustomTableItem,
  SimpleCustomTableProps,
} from './simple-custom-table.model';

export class SimpleCustomTable extends HTMLElement {
  #shadow: ShadowRoot;
  #columnsContainer?: HTMLTableSectionElement;
  #dataRowsContainer?: HTMLTableSectionElement;
  #props: SimpleCustomTableProps = {
    columns: [],
    data: [],
  };

  #createTableHeader(column: SimpleCustomTableColumn) {
    const $th = column.renderHeader ? column.renderHeader() : createElementWithContent('th', column.header);
    column.updateHeader?.($th);
    return $th;
  }

  #createTableHeaders() {
    const $tr = document.createElement('tr');
    for (const column of this.#props.columns) {
      const headerElement = this.#createTableHeader(column);
      $tr.appendChild(headerElement);
    }
    return $tr;
  }

  #createTableCell(column: SimpleCustomTableColumn, rowIndex: number, value: SimpleCustomTableItem) {
    const $td = column.renderCell
      ? column.renderCell(value, rowIndex)
      : createElementWithContent('td', value[column.prop]);

    column.updateCell?.(value, rowIndex, $td);

    return $td;
  }

  #createTableRow(data: SimpleCustomTableItem, rowIndex: number) {
    const $tr = document.createElement('tr');
    $tr.setAttribute('data-rowIndex', rowIndex.toString());
    for (const column of this.#props.columns) {
      const cellElement = this.#createTableCell(column, rowIndex, data);
      $tr.appendChild(cellElement);
    }
    return $tr;
  }

  #createTableRows() {
    const rows: HTMLTableRowElement[] = [];
    for (const [index, item] of this.#props.data.entries()) {
      rows.push(this.#createTableRow(item, index));
    }
    return rows;
  }

  private reloadColumns() {
    this.#columnsContainer?.replaceChildren(this.#createTableHeaders());
  }

  private reloadRows() {
    this.#dataRowsContainer?.replaceChildren(...this.#createTableRows());
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

    this.#columnsContainer = $thead;
    this.#dataRowsContainer = $tbody;
  }

  get columns() {
    return this.#props.columns;
  }

  set columns(value: SimpleCustomTableColumn[]) {
    this.#props.columns = value;
    this.reloadColumns();
    this.reloadRows();
  }

  get data() {
    return this.#props.data;
  }

  set data(value: Record<string, unknown>[]) {
    this.#props.data = value;
    this.reloadRows();
  }
}

customElements.define('simple-custom-table', SimpleCustomTable);

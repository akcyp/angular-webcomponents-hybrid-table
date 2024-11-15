import { SimpleCustomTableColumn, SimpleCustomTableItem, TableElement } from '../simple-custom-table.model';
import { createElementWithContent } from './create-element-with-content';

// Header cell

export const createTableHeader = (column: SimpleCustomTableColumn) => {
  if (column.renderHeader) {
    return column.renderHeader();
  }
  return createElementWithContent('th', column.header);
};

export const updateTableHeader = ($th: TableElement, column: SimpleCustomTableColumn) => {
  if (column.updateHeader) {
    column.updateHeader($th);
    return;
  }
  if ($th instanceof HTMLElement) {
    $th.replaceChildren(document.createTextNode(column.header ?? ''));
  }
};

export const destroyTableHeader = ($th: TableElement, column: SimpleCustomTableColumn) => {
  if (column.removeHeader) {
    column.removeHeader($th);
    return;
  }
  $th.parentNode?.removeChild($th);
};

// Row cell

export const createTableCell = (column: SimpleCustomTableColumn, rowIndex: number, value: SimpleCustomTableItem) => {
  if (column.renderCell) {
    return column.renderCell(value, rowIndex);
  }
  return createElementWithContent('td', value[column.prop]);
};

export const updateTableCell = (
  $td: TableElement,
  column: SimpleCustomTableColumn,
  item: SimpleCustomTableItem,
  rowIndex: number
) => {
  if (column.updateCell) {
    column.updateCell(item, rowIndex, $td);
    return;
  }
  if ($td instanceof HTMLElement) {
    $td.replaceChildren(document.createTextNode(String(item[column.prop] ?? '')));
  }
};

export const destroyTableCell = ($td: TableElement, column: SimpleCustomTableColumn) => {
  if (column.removeCell) {
    column.removeCell($td);
    return;
  }
  $td.parentNode?.removeChild($td);
};

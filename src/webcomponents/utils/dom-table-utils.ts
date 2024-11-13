import { SimpleCustomTableColumn, SimpleCustomTableItem, TableElement } from '../simple-custom-table.model';
import { createElementWithContent } from './create-element-with-content';

// Header cell

export const createTableHeader = (column: SimpleCustomTableColumn) => {
  const $th = column.renderHeader ? column.renderHeader() : createElementWithContent('th', column.header);
  column.updateHeader?.($th);
  return $th;
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
  column.removeHeader?.($th);
};

// Row cell

export const createTableCell = (column: SimpleCustomTableColumn, rowIndex: number, value: SimpleCustomTableItem) => {
  const $td = column.renderCell
    ? column.renderCell(value, rowIndex)
    : createElementWithContent('td', value[column.prop]);

  column.updateCell?.(value, rowIndex, $td);
  return $td;
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
  column.removeCell?.($td);
};

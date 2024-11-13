import type { TableElement } from '../simple-custom-table.model';

export const insertChildAtIndex = (parent: TableElement, child: TableElement, index: number) => {
  if (!index) index = 0;
  if (index >= parent.children.length) {
    parent.appendChild(child);
  } else {
    parent.insertBefore(child, parent.children[index]);
  }
};

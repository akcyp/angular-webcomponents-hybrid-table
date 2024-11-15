import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SimpleCustomTableColumn } from '../webcomponents/simple-custom-table.model';
import { HybridTableModule } from '../hybrid-table/hybrid-table.module';
import { CommonModule } from '@angular/common';

export interface PeriodicElement {
  id: string;
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { id: 'H', position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { id: 'He', position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { id: 'Li', position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { id: 'Be', position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { id: 'B', position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { id: 'C', position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { id: 'N', position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { id: 'O', position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { id: 'F', position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { id: 'Ne', position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

const COLUMNS: SimpleCustomTableColumn[] = [
  {
    prop: 'position',
    header: '#',
  },
  {
    prop: 'name',
    header: 'Name',
    renderHeader: () => {
      const header = document.createElement('th');
      header.style.color = 'lime';
      header.appendChild(document.createTextNode('Name'));
      return header;
    },
  },
  {
    prop: 'weight',
    header: 'Weight',
    renderCell: (item, rowIndex) => {
      const td = document.createElement('td');
      const value = (item['weight'] as number)?.toFixed(2);
      td.appendChild(document.createTextNode(value));
      return td;
    },
    updateCell: (item, rowIndex, cell) => {
      const value = (item['weight'] as number)?.toFixed(2);
      cell.replaceChildren(document.createTextNode(value));
    },
  },
  {
    prop: 'symbol',
    header: 'Symbol',
  },
];

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [CommonModule, HybridTableModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent {
  title = 'angular-webcomponents-table-integration';

  visibleRows = 5;
  maxRowsLength = ELEMENT_DATA.length;
  visibleColumns = 3;
  maxColumnsLenght = COLUMNS.length;

  data = ELEMENT_DATA.slice(0, this.visibleRows);
  columns = COLUMNS.slice(0, this.visibleColumns);

  changeRowsNumber(action: 'add' | 'remove') {
    const value = action === 'add' ? 1 : -1;
    const newLength = this.data.length + value;
    if (newLength < 0 || newLength > ELEMENT_DATA.length) {
      return;
    }
    this.visibleRows = newLength;
    this.data = ELEMENT_DATA.slice(0, newLength);
  }

  changeColumnsNumber(action: 'add' | 'remove') {
    const value = action === 'add' ? 1 : -1;
    const newLength = this.columns.length + value;
    if (newLength < 0 || newLength > COLUMNS.length) {
      return;
    }
    this.visibleColumns = newLength;
    this.columns = COLUMNS.slice(0, newLength);
  }
}

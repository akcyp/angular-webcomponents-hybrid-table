import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SimpleCustomTableColumn } from '../webcomponents/simple-custom-table.model';
import { HybridTableModule } from '../hybrid-table/hybrid-table.module';

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

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [HybridTableModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent {
  title = 'angular-webcomponents-table-integration';

  visibleElements = 5;
  data = ELEMENT_DATA.slice(0, 5);
  columns: SimpleCustomTableColumn[] = [
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
        return header;
      },
    },
    {
      prop: 'weight',
      header: 'Weight',
      renderCell: (item, rowIndex) => {
        const td = document.createElement('td');
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

  addItem() {
    this.visibleElements =
      this.visibleElements >= ELEMENT_DATA.length ? this.visibleElements : this.visibleElements + 1;
    this.data = ELEMENT_DATA.slice(0, this.visibleElements);
  }

  removeItem() {
    this.visibleElements = this.visibleElements <= 0 ? this.visibleElements : this.visibleElements - 1;
    this.data = ELEMENT_DATA.slice(0, this.visibleElements);
  }
}

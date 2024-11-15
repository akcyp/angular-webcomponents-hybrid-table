# Angular - Webcomponents Hybrid Table Workshop

This repository demonstrates how to integrate a table component built with web components (using raw JavaScript or a library like Lit) into an Angular application, achieving a similar API to Angular Material Table.

### Table Web Component Requirements

- Webcomponent table API should accept following properties:
  - **data**: An array of objects representing the table rows.
  - **columns**: An array of objects defining the columns structure and properties, including lifecycle functions for render, update, and beforeRemove (see below).

- Developers should be able to specify three lifecycle functions for row cells and optionally header cells:
  - **render**: Function to render the cell content initially.
  - **update**: Function to update the cell content when data changes.
  - **beforeRemove**: Function to perform any cleanup or actions before the cell is removed.

## Project Structure

- **Example Web Components Table**: Located at `src/webcomponents/simple-custom-table.ts`
- **Integration Module**: Located at `src/hybrid-table/hybrid-table.module.ts`
- **Example Usage**: Located at `src/app/app.component.html`

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js
- Angular CLI

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/akcyp/angular-webcomponents-hybrid-table.git
   cd angular-webcomponents-hybrid-table
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

### Running the Application

To run the application locally:
```sh
ng serve
```

Open your browser and navigate to `http://localhost:4200/`.

## Integrating Web Components Table with Angular

### Step 1: Implement / register the Web Component you want to use

Example web component is defined in `simple-custom-table.ts`:
```typescript
export class SimpleCustomTable extends HTMLElement {
  // Implementation details
  // ...
}

customElements.define('simple-custom-table', SimpleCustomTable);
```

### Step 2: Create the Integration Module

The integration module is defined in `hybrid-table.module.ts`:
```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HybridTableDirective } from './directives/table.directive';
import { HybridColumnDefDirective } from './directives/column.directive';
import { HybridCellDefDirective } from './directives/cell.directive';
import { HybridHeaderCellDefDirective } from './directives/header-cell.directive';

@NgModule({
  declarations: [HybridTableDirective, HybridColumnDefDirective, HybridCellDefDirective, HybridHeaderCellDefDirective],
  exports: [HybridTableDirective, HybridColumnDefDirective, HybridCellDefDirective, HybridHeaderCellDefDirective],
  imports: [CommonModule],
  providers: [],
})
export class HybridTableModule {
  // Implementation details
}
```

### Step 3: Import HybridTableModule
```ts
// With standalone components
@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [CommonModule, HybridTableModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent {}

// With root module
@NgModule({
  declarations: [AppComponent],
  imports: [CommonModule, HybridTableModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
})
export class AppModule {}
```

### Step 4: Use the Integrated Component

The example usage is provided in `app.component.html`:
```html
<simple-custom-table [data]="data" hybrid-table>
  <ng-container hybridColumnDef="position">
    <th *hybridHeaderCellDef>#</th>
    <td *hybridCellDef="let item">{{item.position}}</td>
  </ng-container>
  <ng-container hybridColumnDef="name">
    <th *hybridHeaderCellDef>Name</th>
    <td *hybridCellDef="let item">{{item.name}}</td>
  </ng-container>
  <!-- Additional columns -->
</simple-custom-table>
```

## Conclusion

This project provides an example of how to integrate a web components table with Angular, achieving a similar API to Angular Material Table. The provided directives allow for a seamless integration, making it easy to use web components within an Angular application.

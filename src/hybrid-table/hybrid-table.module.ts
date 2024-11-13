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
export class HybridTableModule {}

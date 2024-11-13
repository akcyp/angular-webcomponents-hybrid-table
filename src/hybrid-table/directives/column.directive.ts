import { ContentChild, Directive, Input } from '@angular/core';

import { HybridHeaderCellDefDirective } from './header-cell.directive';
import { HybridCellDefDirective } from './cell.directive';

@Directive({ selector: '[hybridColumnDef]' })
export class HybridColumnDefDirective<H, C> {
  @Input('hybridColumnDef') column!: string;
  @ContentChild(HybridHeaderCellDefDirective) headerDef?: HybridHeaderCellDefDirective<H>;
  @ContentChild(HybridCellDefDirective) cellDef?: HybridCellDefDirective<C>;
}

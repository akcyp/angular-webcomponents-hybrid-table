import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[hybridHeaderCellDef]' })
export class HybridHeaderCellDefDirective<C> {
  constructor(public templateRef: TemplateRef<C>) {}
}

import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[hybridCellDef]' })
export class HybridCellDefDirective<C> {
  constructor(public templateRef: TemplateRef<C>) {}
}

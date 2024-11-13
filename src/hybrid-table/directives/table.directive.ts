import {
  AfterContentInit,
  ContentChildren,
  Directive,
  ElementRef,
  HostBinding,
  OnChanges,
  OnDestroy,
  QueryList,
  SimpleChanges,
  ViewContainerRef,
} from '@angular/core';
import { HybridColumnDefDirective } from './column.directive';
import { Subject, takeUntil } from 'rxjs';

import { convertCellTemplate, convertHeaderCellTemplate } from '../utils';
import type { SimpleCustomTableColumn } from '../../webcomponents/simple-custom-table.model';
import { SimpleCustomTable } from '../../webcomponents/simple-custom-table';

@Directive({ selector: '[hybrid-table]' })
export class HybridTableDirective implements AfterContentInit, OnDestroy, OnChanges {
  private destroy$ = new Subject();
  private _columns: SimpleCustomTableColumn[] = [];

  @ContentChildren(HybridColumnDefDirective) columnsDefTemplates?: QueryList<
    HybridColumnDefDirective<
      {},
      {
        $implicit: Record<string, unknown>;
      }
    >
  >;

  @HostBinding('columns') get cols() {
    return this._columns;
  }

  constructor(private vcr: ViewContainerRef, private elementRef: ElementRef<SimpleCustomTable>) {}

  ngAfterContentInit() {
    this.reloadColumns();
    this.columnsDefTemplates!.changes.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.reloadColumns();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['columns'] && this.columnsDefTemplates) {
      this.reloadColumns();
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  private reloadColumns() {
    this._columns = (this.columnsDefTemplates ?? []).map(({ column, cellDef, headerDef }) => {
      const result: SimpleCustomTableColumn = {
        prop: column,
      };
      if (cellDef) {
        const props = convertCellTemplate(cellDef.templateRef, this.vcr);
        Object.assign(result, props);
      }
      if (headerDef) {
        const props = convertHeaderCellTemplate(headerDef.templateRef, this.vcr);
        Object.assign(result, props);
      }
      return result;
    });
  }
}

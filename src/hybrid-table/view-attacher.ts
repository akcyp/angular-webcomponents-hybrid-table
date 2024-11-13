import { EmbeddedViewRef, TemplateRef, ViewContainerRef } from '@angular/core';
import type {
  SimpleCustomTableColumn,
  SimpleCustomTableItem,
  TableElement,
} from '../webcomponents/simple-custom-table.model';

const attachSymbol = Symbol();
const assignAngularViewToHTMLElement = (element: TableElement, view: EmbeddedViewRef<any>) => {
  (element as any)[attachSymbol] = view;
};
const unassignAngularViewFromHTMLElement = (element: TableElement) => {
  (element as any)[attachSymbol] = undefined;
};
const getAssignedAngularViewFromHTMLElement = (element: TableElement) => {
  return (element as any)[attachSymbol] as EmbeddedViewRef<any>;
};

const attachEmbeddedViewToHTMLElement = <C>(
  element: TableElement,
  vcr: ViewContainerRef,
  templateRef: TemplateRef<C>,
  context: C
) => {
  const embeddedView = templateRef.createEmbeddedView(context);
  vcr.insert(embeddedView);
  embeddedView.onDestroy(() => {
    // Old angular versions does not support automatic detach
    const index = vcr.indexOf(embeddedView);
    if (index > -1) {
      vcr.remove(index);
    }
  });
  element.append(...embeddedView.rootNodes);
  assignAngularViewToHTMLElement(element, embeddedView);
  return embeddedView;
};

const detachEmbeddedViewFromHTMLElement = <C>(element: TableElement, view: EmbeddedViewRef<C>) => {
  view.destroy();
  view.rootNodes.forEach((node) => (node as HTMLElement).parentNode?.removeChild(node));
  unassignAngularViewFromHTMLElement(element);
};

export const convertCellTemplate = (
  templateRef: TemplateRef<{
    $implicit: SimpleCustomTableItem;
  }>,
  vcr: ViewContainerRef
): Pick<SimpleCustomTableColumn, 'renderCell' | 'updateCell' | 'removeCell'> => {
  return {
    renderCell(props, rowIndex) {
      return document.createDocumentFragment();
    },
    updateCell(props, rowIndex, cell) {
      const context = { $implicit: props };
      const view =
        getAssignedAngularViewFromHTMLElement(cell) ?? attachEmbeddedViewToHTMLElement(cell, vcr, templateRef, context);
      Object.assign(view.context, context);
      view.detectChanges();
    },
    removeCell(cell) {
      const view = getAssignedAngularViewFromHTMLElement(cell);
      if (!view) return;
      detachEmbeddedViewFromHTMLElement(cell, view);
    },
  };
};

export const convertHeaderCellTemplate = (
  templateRef: TemplateRef<{}>,
  vcr: ViewContainerRef
): Pick<SimpleCustomTableColumn, 'renderHeader' | 'updateHeader' | 'removeHeader'> => {
  return {
    renderHeader() {
      return document.createDocumentFragment();
    },
    updateHeader(cell) {
      const context = {};
      const view =
        getAssignedAngularViewFromHTMLElement(cell) ?? attachEmbeddedViewToHTMLElement(cell, vcr, templateRef, context);
      Object.assign(view.context, context);
      view.detectChanges();
    },
    removeHeader(cell) {
      const view = getAssignedAngularViewFromHTMLElement(cell);
      if (!view) return;
      detachEmbeddedViewFromHTMLElement(cell, view);
    },
  };
};

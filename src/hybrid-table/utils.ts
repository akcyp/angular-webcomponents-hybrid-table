import { EmbeddedViewRef, TemplateRef, ViewContainerRef } from '@angular/core';
import type { SimpleCustomTableColumn, SimpleCustomTableItem } from '../webcomponents/simple-custom-table.model';

const attachSymbol = Symbol();
const attachAngularViewToHTMLElement = (element: HTMLElement | DocumentFragment, view: EmbeddedViewRef<any>) => {
  (element as any)[attachSymbol] = view;
};
const detachAngularViewFromHTMLElement = (element: HTMLElement | DocumentFragment) => {
  (element as any)[attachSymbol] = undefined;
};
const getAngularViewFromHTMLElement = (element: HTMLElement | DocumentFragment) => {
  return (element as any)[attachSymbol] as EmbeddedViewRef<any>;
};

const attachEmbeddedViewToHTMLElement = <C>(
  element: HTMLElement | DocumentFragment,
  vcr: ViewContainerRef,
  templateRef: TemplateRef<C>,
  context: C
) => {
  const embeddedView = templateRef.createEmbeddedView(context);
  vcr.insert(embeddedView);
  embeddedView.onDestroy(() => {
    const index = vcr.indexOf(embeddedView);
    vcr.remove(index);
  });
  element.append(...embeddedView.rootNodes);
  attachAngularViewToHTMLElement(element, embeddedView);
  return embeddedView;
};

const detachEmbeddedViewFromHTMLElement = <C>(element: HTMLElement | DocumentFragment, view: EmbeddedViewRef<C>) => {
  view.destroy();
  view.rootNodes.forEach((node) => element.removeChild(node));
  detachAngularViewFromHTMLElement(element);
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
        getAngularViewFromHTMLElement(cell) ?? attachEmbeddedViewToHTMLElement(cell, vcr, templateRef, context);
      view.context = context;
      view.detectChanges();
    },
    removeCell(cell) {
      const view = getAngularViewFromHTMLElement(cell);
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
        getAngularViewFromHTMLElement(cell) ?? attachEmbeddedViewToHTMLElement(cell, vcr, templateRef, context);
      view.context = context;
      view.detectChanges();
    },
    removeHeader(cell) {
      const view = getAngularViewFromHTMLElement(cell);
      if (!view) return;
      detachEmbeddedViewFromHTMLElement(cell, view);
    },
  };
};

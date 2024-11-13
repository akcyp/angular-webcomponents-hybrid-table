export const createElementWithContent = <K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  content: unknown
): HTMLElementTagNameMap[K] => {
  const element = document.createElement(tagName);
  const contentElement = document.createTextNode(String(content));
  element.appendChild(contentElement);
  return element;
};

import '@testing-library/jest-dom/vitest';

// jsdom does not implement scrollIntoView / scrollTo; stub them so components
// that call them in effects do not throw during tests.
if (!window.HTMLElement.prototype.scrollIntoView) {
  window.HTMLElement.prototype.scrollIntoView = () => {};
}
window.scrollTo = () => {};

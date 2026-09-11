import '@testing-library/jest-dom';

// jsdom doesn't implement window.matchMedia — stub it so any component
// that calls matchMedia (e.g. ThemeContext, Lenis) doesn't throw.
if (typeof window !== 'undefined' && !window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query) => ({
      matches:             false,
      media:               query,
      onchange:            null,
      addListener:         () => {},
      removeListener:      () => {},
      addEventListener:    () => {},
      removeEventListener: () => {},
      dispatchEvent:       () => false,
    }),
  });
}

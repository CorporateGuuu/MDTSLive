const Sentry = {
  init: jest.fn(),
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  withSentry: jest.fn((component) => component),
  ErrorBoundary: ({ children, fallback }) => children || fallback,
};

module.exports = Sentry;

// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';

const consoleError = console.error;

// suppresses warning texts for the known bug https://github.com/testing-library/react-hooks-testing-library/issues/14
console.error = (...args: string[]) => {
  if (
    !(
      args.length >= 1 &&
      args[0].startsWith(
        'Warning: An update to %s inside a test was not wrapped in act'
      )
    )
  ) {
    consoleError(...args);
  }
};

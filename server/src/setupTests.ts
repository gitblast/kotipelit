/** without this socket.io server export in index.ts causes problems in tests */
jest.mock('./index', () => {
  return {};
});

jest.useFakeTimers();

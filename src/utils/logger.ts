/* eslint-disable no-undef */
export const log = (msg: unknown): void => {
  // eslint-disable-next-line no-undef
  if (process && process.env && process.env.NODE_ENV === 'development')
    console.log(msg);
};

export default {
  debug: false,
  log: function (...args: unknown[]) {
    if (this.debug) {
      console.log(...args);
    } else if (
      process &&
      process.env &&
      process.env.NODE_ENV === 'development'
    ) {
      // if not in debug mode, log only if in dev env
      console.log(...args);
    }
  },
  error: function (...args: unknown[]) {
    if (this.debug) {
      console.error(...args);
    } else if (!(process && process.env && process.env.NODE_ENV === 'test')) {
      // if not in debug mode, show errors unless in test env
      console.error(...args);
    }
  },
};

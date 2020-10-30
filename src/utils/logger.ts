const logger = {
  debug: false,
  log: function (...args: unknown[]): void {
    if (this.debug) {
      console.log(...args);
    } else if (process.env.NODE_ENV === 'development') {
      // if not in debug mode, log only if in dev env
      console.log(...args);
    }
  },
  error: function (...args: unknown[]): void {
    if (this.debug) {
      console.error(...args);
    } else if (!(process.env.NODE_ENV === 'test')) {
      // if not in debug mode, show errors unless in test env
      console.error(...args);
    }
  },
};

export const setDebug = (value: boolean): void => {
  logger.debug = value;
};

export default logger;

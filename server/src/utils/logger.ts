const logger = {
  debug: false,
  log: function (...args: unknown[]): void {
    if (this.debug) {
      console.log(new Date().toLocaleString(), ...args);
    } else if (process.env.NODE_ENV === 'development') {
      // if not in debug mode, log only if in dev env
      console.log(new Date().toLocaleString(), ...args);
    }
  },
  error: function (...args: unknown[]): void {
    if (this.debug) {
      console.error(new Date().toLocaleString(), ...args);
    } else if (!(process.env.NODE_ENV === 'test')) {
      // if not in debug mode, show errors unless in test env
      console.error(new Date().toLocaleString(), ...args);
    }
  },
};

export const setDebug = (value: boolean): void => {
  logger.debug = value;
};

export default logger;

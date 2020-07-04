const LOGGING_ON = true;

export const log = (msg: string): void => {
  if (LOGGING_ON && process.env.NODE_ENV !== 'test') {
    console.log(msg);
  }
};

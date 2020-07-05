export const log = (msg: unknown): void => {
  // eslint-disable-next-line no-undef
  if (process && process.env && process.env.NODE_ENV === 'development')
    console.log(msg);
};

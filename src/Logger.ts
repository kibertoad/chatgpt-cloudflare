export type ErrorHandler = (err: Error) => void | Promise<void>;

export const defaultErrorHandler: ErrorHandler = (err: Error) => {
  console.error(err.message);
};

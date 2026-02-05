export default class ExpressError extends Error {
  statusCode: number;
  details?: string | unknown;

  constructor(message: string, statusCode: number, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = "ExpressError";
    Error.captureStackTrace(this, this.constructor);
  }
}

export default class HttpError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'HttpError';
    this.statusCode = statusCode;
  }
}
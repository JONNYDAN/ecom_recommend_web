export default class DetailError extends Error {
  constructor(message, errorCode) {
    super(message);
    this.detail = message;
    this.errorCode = errorCode;

    // create a clone field of the whole object
    this.error = { ...this, error: undefined };
    delete this.error.error;
  }
}

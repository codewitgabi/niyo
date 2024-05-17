import { StatusCodes } from "http-status-codes";

export class ApiError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
  }
}

export class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

export class PermissionDeniedError extends Error {
  constructor(message = "") {
    super(message);
    this.message =
      message || "You do not have permission to perform this action";
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

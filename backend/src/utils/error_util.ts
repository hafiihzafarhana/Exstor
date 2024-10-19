import { StatusCodes } from 'http-status-codes';

export interface IErrorResponse {
  message: string;
  statusCode: number;
  status: string;
  comingFrom: string;
  serializeErrors(): IError;
}

export interface IError {
  message: string;
  statusCode: number;
  status: string;
  comingFrom: string;
}

export abstract class CustomError extends Error {
  abstract statusCode: number;
  status: string;
  comingFrom: string;

  constructor(message: string, comingFrom: string, status: string = 'error') {
    super(message);
    this.comingFrom = comingFrom;
    this.status = status; // Nilai `status` dapat diberikan secara manual, default 'error'
  }

  serializeErrors(): IError {
    return {
      message: this.message,
      statusCode: this.statusCode,
      status: this.status,
      comingFrom: this.comingFrom
    };
  }
}

export class BadRequestError extends CustomError {
  statusCode = StatusCodes.BAD_REQUEST;

  constructor(message: string, comingFrom: string, status?: string) {
    super(message, comingFrom, status); // Status bisa diberikan manual
  }
}

export class NotFoundError extends CustomError {
  statusCode = StatusCodes.NOT_FOUND;

  constructor(message: string, comingFrom: string, status?: string) {
    super(message, comingFrom, status);
  }
}

export class Forbidden extends CustomError {
  statusCode = StatusCodes.FORBIDDEN;

  constructor(message: string, comingFrom: string, status?: string) {
    super(message, comingFrom, status);
  }
}

export class NotAuthorizedError extends CustomError {
  statusCode = StatusCodes.UNAUTHORIZED;

  constructor(message: string, comingFrom: string, status?: string) {
    super(message, comingFrom, status);
  }
}

export class FileTooLargeError extends CustomError {
  statusCode = StatusCodes.REQUEST_TOO_LONG;

  constructor(message: string, comingFrom: string, status?: string) {
    super(message, comingFrom, status);
  }
}

export class ServerError extends CustomError {
  statusCode = StatusCodes.SERVICE_UNAVAILABLE;

  constructor(message: string, comingFrom: string, status?: string) {
    super(message, comingFrom, status);
  }
}

export interface ErrnoException extends Error {
  errno?: number;
  code?: string;
  path?: string;
  syscall?: string;
  stack?: string;
}

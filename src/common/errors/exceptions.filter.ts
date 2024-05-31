import { ArgumentsHost, Catch, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

// Check if an object has `errno` and `code` properties, indicative of a database error
function isDatabaseError(error: unknown): error is { errno: number; code: string } {
  return typeof error === 'object' && error !== null && 'errno' in error && 'code' in error;
}

// Check if an object is an instance of Error and has a `message` property
function isErrorWithMessage(error: unknown): error is Error {
  return error instanceof Error;
}

@Catch()
export class ExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(ExceptionsFilter.name);

  override async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'An unexpected error occurred';
    let stack: string | undefined = '';

    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      message = typeof response === 'object' && response.hasOwnProperty('message') ? response['message'] : response;
      stack = exception.stack;
    } else if (isDatabaseError(exception)) {
      if (exception.errno === 1062 && exception.code === 'ER_DUP_ENTRY') {
        status = HttpStatus.CONFLICT;
        message = 'Duplicate entry';
      }
    } else if (isErrorWithMessage(exception)) {
      // For generic errors with a message
      message = exception.message;
      stack = exception.stack;
    }

    const originalRequest = request.originalUrl || request.url;
    const requestType = request.method;
    this.logger.error(`${requestType} ${status} ${originalRequest} Message: ${message} Stack: \n${stack}`);

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}

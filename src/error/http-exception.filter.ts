import { Environment, EnvironmentKey } from '@/config';
import { IApiResponse } from '@/type/api-response.type';
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    console.log((exception as any)?.stack);

    // Get the NODE_ENV value from ConfigService
    const nodeEnv = this.configService.get<string>(EnvironmentKey.NODE_ENV);
    const isDevelopment = nodeEnv === Environment.Development;

    // ----- initial variables
    let status = HttpStatus.BAD_REQUEST;
    let message = 'Internal server error' as any;
    let stack = null;
    let errors = null;

    // ----- Handle BadRequestException
    if (exception instanceof BadRequestException) {
      status = HttpStatus.BAD_REQUEST;
      message = (exception.getResponse() as any)?.error;
      errors = (exception.getResponse() as any)?.message;
      stack = exception.stack;

      // ----- Handle NotFoundException
    } else if (exception instanceof NotFoundException) {
      status = exception.getStatus();
      message = (exception.getResponse() as any)?.message;
      stack = exception.stack;

      // ----- Handle UnauthorizedException
    } else if (exception instanceof UnauthorizedException) {
      status = exception.getStatus();
      message = exception.getResponse();
      stack = exception.stack;

      // ----- Handle HttpException
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = (exception.getResponse() as any)?.message;
      stack = exception.stack;

      // ----- Handle Mongoose Duplicate Key Error
    } else if ((exception as any).code === 11000) {
      status = HttpStatus.CONFLICT;
      const keyPattern = (exception as any).keyPattern;
      const keyValue = (exception as any).keyValue;
      const duplicateField = keyPattern
        ? Object.keys(keyPattern)[0]
        : 'unknown field';
      const duplicateValue = keyValue
        ? keyValue[duplicateField]
        : 'unknown value';
      message = `${duplicateField} with value ${duplicateValue} already exists`;
      stack = (exception as any).stack;

      // ----- Handle Error
    } else if (exception instanceof Error) {
      message = exception.message;
      stack = exception.stack;
    }

    const errorResponse: IApiResponse = {
      success: false,
      message,
      path: request.url,
      errors: errors || undefined,
      stack: isDevelopment && stack ? stack : undefined, // Include stack trace only in development
    };

    response.status(status).json(errorResponse);
  }
}

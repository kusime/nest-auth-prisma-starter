import { ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponse } from '../interface/api-response';

export default (
  exception: HttpException,
  host: ArgumentsHost,
  options: {
    handlerName: string;
    exceptionName: string;
    logger: Logger;
  },
) => {
  // extract the information from the ArgumentsHost
  const response = host.switchToHttp().getResponse<Response>();
  const request = host.switchToHttp().getRequest<Request>();
  // getResponse the argument provided in the cause location provided argument
  // the default exception will construct a default exception package with the arguments that passed into the Exception constructor so , use exception.getResponse can intercept that information to rebuild the final response body
  const exceptionResponse = exception.getResponse(); // construct by the exception builder with the custom arguments passed in
  const code = exception.getStatus();

  // log the exception
  options.logger.error(
    `|| Caught by ${options.handlerName} || ${options.exceptionName} at [${request.path}] ==> Because of `,
    exceptionResponse,
  );
  const responseBody: ApiResponse = {
    info: {
      statusCode: code,
      message: exceptionResponse['message'],
      error: exceptionResponse['error'],
    },
    isSuccess: false,
  };

  // build the error response
  response.status(code);
  response.json(responseBody);
};

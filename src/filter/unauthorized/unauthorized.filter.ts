import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import builder from '../builder';

@Catch(UnauthorizedException)
export class UnauthorizedFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}
  // exception : the default exception return response body
  // host : all the information about this exception
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    builder(exception, host, {
      handlerName: 'UnauthorizedFilter',
      exceptionName: 'UnauthorizedException',
      logger: this.logger,
    });
  }
}

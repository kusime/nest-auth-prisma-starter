import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  Logger,
} from '@nestjs/common';
import builder from '../builder';

@Catch(BadRequestException)
export class BadRequestFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}
  catch(exception: BadRequestException, host: ArgumentsHost) {
    builder(exception, host, {
      handlerName: 'BadRequestFilter',
      exceptionName: 'BadRequestException',
      logger: this.logger,
    });
  }
}

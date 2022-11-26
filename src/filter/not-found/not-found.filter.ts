import {
  ArgumentsHost,
  NotFoundException,
  Catch,
  ExceptionFilter,
  Logger,
} from '@nestjs/common';
import builder from '../builder';

@Catch(NotFoundException)
export class BadRequestFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}
  catch(exception: NotFoundException, host: ArgumentsHost) {
    builder(exception, host, {
      handlerName: 'NotFoundException',
      exceptionName: 'NotFoundException',
      logger: this.logger,
    });
  }
}

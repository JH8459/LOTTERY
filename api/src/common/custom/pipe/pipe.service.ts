import { Injectable } from '@nestjs/common';
import { ValidationError, ValidationPipeOptions } from '@nestjs/common';
import { CustomBadRequestException } from 'src/common/custom/exception/exception.service';
import { CustomLoggerService } from 'src/module/logger/logger.service';

@Injectable()
export class ValidationPipeService {
  constructor(private readonly loggerService: CustomLoggerService) {}

  getConfig(): ValidationPipeOptions {
    return {
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,

      exceptionFactory: (validationErrors: ValidationError[]) => {
        validationErrors.forEach(({ property, constraints }) => {
          this.loggerService.warn(
            `에러 발생 키: ${property}, 에러 제목: ${Object.keys(constraints)}, 에러 내용: ${Object.values(
              constraints
            )}`,
            '🚧 유효성 검사 에러 🚧'
          );
        });

        const allMessages = validationErrors
          .map((error) => {
            const field = error.property;
            const messages = Object.values(error.constraints ?? {}).join(', ');
            return `• ${field}: ${messages}`;
          })
          .join('\n');

        throw new CustomBadRequestException(allMessages);
      },
    };
  }
}

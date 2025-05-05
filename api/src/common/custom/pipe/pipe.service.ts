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

        const firstError = validationErrors[0];
        const firstErrorMessage = firstError
          ? Object.values(firstError.constraints ?? {}).join(', ')
          : '유효성 검사 에러가 발생했습니다.';

        throw new CustomBadRequestException(firstErrorMessage);
      },
    };
  }
}

import { ValidationError } from 'class-validator';
import { CustomBadRequestException } from 'src/common/custom/exception/exception.service';
import { CustomLoggerService } from '../module/logger/logger.service';

/**
 *
 * @description: class-validator의 유효성 검사 옵션을 설정하는 객체입니다.
 */
export const VALIDATION_CONFIG = {
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,

  /**
   * 유효성 검사 에러를 처리하는 예외 팩토리 함수
   * @param validationErrors 유효성 검사 에러 목록
   */
  exceptionFactory: (validationErrors: ValidationError[]) => {
    const logger = new CustomLoggerService();

    validationErrors.forEach(({ property, constraints }) => {
      logger.warn(
        `에러 발생 키: ${property}, 에러 제목: ${Object.keys(constraints)}, 에러 내용: ${Object.values(constraints)}`,
        '🚧🚧🚧🚧 유효성 검사 에러 🚧🚧🚧🚧'
      );
    });

    const firstValidationErrorMessage = Object.values(validationErrors[0].constraints)[0];

    throw new CustomBadRequestException(firstValidationErrorMessage);
  },
};

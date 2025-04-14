import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { CustomBadRequestException } from '../exception/exception.service';

/**
 *
 * @description: @Body 데코레이터를 통해 들어온 DTO를 검증하는 파이프입니다.
 */
@Injectable()
export class CustomDTOValidationPipe<T> implements PipeTransform {
  constructor(private readonly dto: new () => T) {}

  transform(value: T, metadata: ArgumentMetadata): object {
    // @Body 데코레이터로 전달된 데이터만 검증
    if (metadata.type !== 'body') {
      return value as object;
    }

    const object = plainToClass(this.dto, value) as object;
    const errors = validateSync(object, { skipMissingProperties: false });

    if (errors.length > 0) {
      throw new CustomBadRequestException('잘못된 파라미터 입니다.');
    }

    return object;
  }
}

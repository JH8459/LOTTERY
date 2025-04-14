import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

/**
 *
 * @description: BadRequestException을 상속받아 커스텀된 statusCode와 message를 받아서 처리하는 클래스입니다.
 */
export class CustomBadRequestException extends BadRequestException {
  constructor(errorMessage: string) {
    super({
      statusCode: HttpStatus.BAD_REQUEST,
      message: errorMessage,
    });
  }
}

/**
 *
 * @description: NotFoundException을 상속받아 커스텀된 statusCode와 message를 받아서 처리하는 클래스입니다.
 */
export class CustomNotFoundException extends NotFoundException {
  constructor(errorMessage: string) {
    super({
      statusCode: HttpStatus.NOT_FOUND,
      message: errorMessage,
    });
  }
}

/**
 *
 * @description: ConflictException을 상속받아 커스텀된 statusCode와 message를 받아서 처리하는 클래스입니다.
 */
export class CustomConflictException extends ConflictException {
  constructor(errorMessage: string) {
    super({
      statusCode: HttpStatus.CONFLICT,
      message: errorMessage,
    });
  }
}

/**
 *
 * @description: InternalServerErrorException을 상속받아 커스텀된 statusCode와 message를 받아서 처리하는 클래스입니다.
 */
export class CustomInternalServerErrorException extends InternalServerErrorException {
  constructor(errorMessage: string) {
    super({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: errorMessage,
    });
  }
}

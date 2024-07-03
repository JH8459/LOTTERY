import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { QnaEntity } from 'src/entity/qna.entity';

class QnaOptionalDto extends PickType(QnaEntity, ['name']) {}

class QnaRequiredDto extends PickType(QnaEntity, ['email', 'question']) {}

export class QnaRegistInfoDto extends IntersectionType(QnaRequiredDto, QnaOptionalDto) {}

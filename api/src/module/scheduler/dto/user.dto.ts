import { PickType } from '@nestjs/swagger';
import { UserEntity } from 'src/entity/user.entity';

export class SubscribeUserInfoDto extends PickType(UserEntity, ['userIdx', 'userEmail']) {}

import { IntersectionType, PickType } from '@nestjs/swagger';
import { UserEntity } from 'src/entity/user.entity';
import { WorkspaceEntity } from 'src/entity/workspace.entity';

export class UserInfoDto extends IntersectionType(
  PickType(WorkspaceEntity, ['workspaceId']),
  PickType(UserEntity, ['userIdx', 'workspaceIdx', 'userId', 'userEmail', 'isSlackSubscribe', 'isEmailSubscribe'])
) {}

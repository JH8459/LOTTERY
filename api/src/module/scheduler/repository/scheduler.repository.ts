import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SUBSCRIBE_TYPE } from 'src/common/constant/enum';
import { UserEntity } from 'src/entity/user.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { SubscribeUserInfoDto } from '../dto/user.dto';

@Injectable()
export class SchedulerRepository {
  constructor(@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>) {}

  async getSubscribeUsers(subscribeType: SUBSCRIBE_TYPE): Promise<SubscribeUserInfoDto[]> {
    const userListQueryBuilder: SelectQueryBuilder<UserEntity> = this.userModel
      .createQueryBuilder('userEntity')
      .select(['userEntity.userIdx AS userIdx', 'userEntity.userEmail AS userEmail']);

    if (subscribeType === SUBSCRIBE_TYPE.SLACK) {
      userListQueryBuilder.andWhere('userEntity.isSlackSubscribe = :isSlackSubscribe', {
        isSlackSubscribe: true,
      });
    } else if (subscribeType === SUBSCRIBE_TYPE.EMAIL) {
      userListQueryBuilder.andWhere('userEntity.isEmailSubscribe = :isEmailSubscribe', {
        isEmailSubscribe: true,
      });
    }

    const userList: SubscribeUserInfoDto[] = await userListQueryBuilder.getRawMany();

    return userList;
  }
}

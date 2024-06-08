import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SchedulerRepository {
  constructor(@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>) {}

  async getSubscribeUsers(): Promise<UserEntity[]> {
    const userList: UserEntity[] = await this.userModel
      .createQueryBuilder('userEntity')
      .select(['userEntity.userIdx AS userIdx'])
      .where('userEntity.isSubscribe = :isSubscribe', { isSubscribe: true })
      .getRawMany();

    return userList;
  }
}

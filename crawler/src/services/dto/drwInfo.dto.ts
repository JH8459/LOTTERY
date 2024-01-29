import { DrwtNoInterface } from '../interface/scheduler.interface';

export class DrwInfoDto {
  drwNo: number;
  drwtNoList: DrwtNoInterface[];
  firstWinamnt: number;
  firstPrzwnerCo: number;
  secondWinamnt: number;
  secondPrzwnerCo: number;
  thirdWinamnt: number;
  thirdPrzwnerCo: number;
  drwNoDate: Date;
}

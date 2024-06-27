import { DrwtNoInterface } from '../interface/scheduler.interface';

export class LottoDrwInfoDto {
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

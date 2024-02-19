export interface LottoInfoInterface {
  drwNo: number;
  drwtNo1: number;
  drwtNo2: number;
  drwtNo3: number;
  drwtNo4: number;
  drwtNo5: number;
  drwtNo6: number;
  bnusNo: number;
  firstWinamnt?: number;
  firstPrzwnerCo?: number;
  secondWinamnt?: number;
  secondPrzwnerCo?: number;
  thirdWinamnt?: number;
  thirdPrzwnerCo?: number;
  drwNoDate: Date;
}

export interface LottoStatisticInfoInterface {
  firstLottoNo: number;
  firstLottoNoCnt: number;
  secondLottoNo: number;
  secondLottoNoCnt: number;
  thirdLottoNo: number;
  thirdLottoNoCnt: number;
}

export interface LottoHighestPrizeInfoInterface {
  thisYearDrwNo: number;
  thisYearFirstWinamnt: number;
  thisYearFirstPrzwnerCo: number;
  thisYearDrwNoDate: Date;
  lastYearDrwNo: number;
  lastYearFirstWinamnt: number;
  lastYearFirstPrzwnerCo: number;
  lastYearDrwNoDate: Date;
}

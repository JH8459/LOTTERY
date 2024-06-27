export interface DrwtNoInterface {
  no: string;
  value: number;
}

export interface StatisticDrwNoInterface {
  lottoNo: number;
  cnt: number;
}

export interface HighestPrizeDrwNoInterface {
  drwNo: number;
  firstWinamnt: number;
  firstPrzwnerCo: number;
  drwNoDate: Date;
}

export interface SpeettoPrizeInfo {
  [key: string]: Date | number | string;
  drwNo: number;
  speettoType: number;
  firstPrizeDate: Date;
  firstWinAmnt: string;
  firstWinCnt: number;
  secondPrizeDate: Date;
  secondWinAmnt: string;
  secondWinCnt: number;
  thirdPrizeDate: Date;
  thirdWinAmnt: string;
  thirdWinCnt: number;
  saleDate: Date;
  saleRate: number;
}

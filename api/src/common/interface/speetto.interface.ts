/**
 * @description SpeettoInfoInterface는 스피또 당첨 정보에 대한 인터페이스입니다.
 * @interface
 * @property {number} drwNo - 회차
 * @property {number} speettoType - 스피또 종류
 * @property {Date} firstPrizeDate - 1등 당첨일
 * @property {string} firstWinAmnt - 1등 당첨금
 * @property {number} firstWinCnt - 1등 당첨자 수
 * @property {Date} secondPrizeDate - 2등 당첨일
 * @property {string} secondWinAmnt - 2등 당첨금
 * @property {number} secondWinCnt - 2등 당첨자 수
 * @property {Date} thirdPrizeDate - 3등 당첨일
 * @property {string} thirdWinAmnt - 3등 당첨금
 * @property {number} thirdWinCnt - 3등 당첨자 수
 * @property {Date} saleDate - 판매일
 * @property {number} saleRate - 판매율
 */
export interface SpeettoInfoInterface {
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

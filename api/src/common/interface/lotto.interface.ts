/**
 * @description LottoInfoInterface는 로또 당첨 정보에 대한 인터페이스입니다.
 * @interface
 * @property {number} drwNo - 회차
 * @property {number} drwtNo1 - 1번 번호
 * @property {number} drwtNo2 - 2번 번호
 * @property {number} drwtNo3 - 3번 번호
 * @property {number} drwtNo4 - 4번 번호
 * @property {number} drwtNo5 - 5번 번호
 * @property {number} drwtNo6 - 6번 번호
 * @property {number} bnusNo - 보너스 번호
 * @property {number} [firstWinamnt] - 1등 당첨금
 * @property {number} [firstPrzwnerCo] - 1등 당첨자 수
 * @property {number} [secondWinamnt] - 2등 당첨금
 * @property {number} [secondPrzwnerCo] - 2등 당첨자 수
 * @property {number} [thirdWinamnt] - 3등 당첨금
 * @property {number} [thirdPrzwnerCo] - 3등 당첨자 수
 * @property {Date} drwNoDate - 회차 날짜
 */
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

/**
 * @description LottoStatisticInfoInterface는 로또 당첨 통계 정보에 대한 인터페이스입니다.
 * @interface
 * @property {number} firstLottoNo - 최다 당첨 번호
 * @property {number} firstLottoNoCnt - 최다 당첨 번호 횟수
 * @property {number} secondLottoNo - 두 번째 최다 당첨 번호
 * @property {number} secondLottoNoCnt - 두 번째 최다 당첨 번호 횟수
 * @property {number} thirdLottoNo - 세 번째 최다 당첨 번호
 * @property {number} thirdLottoNoCnt - 세 번째 최다 당첨 번호 횟수
 */
export interface LottoStatisticInfoInterface {
  firstLottoNo: number;
  firstLottoNoCnt: number;
  secondLottoNo: number;
  secondLottoNoCnt: number;
  thirdLottoNo: number;
  thirdLottoNoCnt: number;
}

/**
 * @description LottoHighestPrizeInfoInterface는 로또 당첨금 정보에 대한 인터페이스입니다.
 * @interface
 * @property {number} thisYearDrwNo - 올해 최대 당첨금액 회차
 * @property {number} thisYearFirstWinamnt - 올해 최대 당첨금액
 * @property {number} thisYearFirstPrzwnerCo - 올해 최대 당첨자 수
 * @property {Date} thisYearDrwNoDate - 올해 최대 당첨금액 회차 날짜
 * @property {number} lastYearDrwNo - 작년 최대 당첨금액 회차
 * @property {number} lastYearFirstWinamnt - 작년 최대 당첨금액
 * @property {number} lastYearFirstPrzwnerCo - 작년 최대 당첨자 수
 * @property {Date} lastYearDrwNoDate - 작년 최대 당첨금액 회차 날짜
 */
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

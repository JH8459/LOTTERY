import axios, { AxiosResponse } from 'axios';
import ioredis from 'ioredis';
import cheerio, { CheerioAPI, Element } from 'cheerio';
import iconv from 'iconv-lite';
import schedule from 'node-schedule';
import { scheduleJob } from 'node-schedule';
import {
  getHighestPrizeByYear,
  getRecentlyLottoDrwNo,
  getStatisticByDrwNo,
  insertDrwInfo,
} from '../repositories/lotto.repository';
import {
  DrwtNoInterface,
  HighestPrizeDrwNoInterface,
  SpeettoPrizeInfo,
  StatisticDrwNoInterface,
} from './interface/scheduler.interface';
import { LottoDrwInfoDto } from './dto/drwInfo.dto';
import { insertSpeetoPrizeInfo } from '../repositories/speetto.repository';

export const lottoSchedule = (rule: schedule.RecurrenceRule) =>
  scheduleJob(rule, async () => {
    const redis = new ioredis(6379, 'lottery_redis');

    let drwNo: number = 0;
    const drwtNoList: DrwtNoInterface[] = [];
    let firstWinamnt: number = 0;
    let firstPrzwnerCo: number = 0;
    let secondWinamnt: number = 0;
    let secondPrzwnerCo: number = 0;
    let thirdWinamnt: number = 0;
    let thirdPrzwnerCo: number = 0;
    let drwNoDate: Date = new Date();

    try {
      // Axios
      const response: AxiosResponse = await axios.get('https://dhlottery.co.kr/gameResult.do?method=byWin');

      // Cheerio Crawling
      const $: CheerioAPI = cheerio.load(response.data);
      const $drwNoInfo = $('div.win_result')
        .children('h4')
        .find('strong')
        .text()
        .replace(/[^0-9]/g, '');
      const $winamntPrzInfo = $('table.tbl_data_col').children('tbody');
      const $drwtNoListInfo = $('div.win_result').children('div.nums').children('div.win').children('p');
      const $drwtBonumNoInfo = $('div.win_result').children('div.nums').children('div.bonus').find('span').text();
      const $drwNoDateInfo = $('div.win_result')
        .find('p.desc')
        .text()
        .replace(/[^0-9]/g, '');

      // Data Setting
      drwNo = Number($drwNoInfo);
      $drwtNoListInfo.find('span').each((trIdx: number, trElement: Element) => {
        drwtNoList.push({ no: `${trIdx + 1}`, value: Number($(trElement).text()) });
      });
      drwtNoList.push({ no: 'bonus', value: Number($drwtBonumNoInfo) });
      $winamntPrzInfo.find('tr').each((trIdx: number, trElement: Element) => {
        $(trElement)
          .find('td')
          .each((tdIdx: number, tdElement: Element) => {
            if (trIdx === 0) {
              if (tdIdx === 2) {
                firstPrzwnerCo = Number(
                  $(tdElement)
                    .text()
                    .replace(/[^0-9]/g, '')
                );
              }

              if (tdIdx === 3) {
                firstWinamnt = Number(
                  $(tdElement)
                    .text()
                    .replace(/[^0-9]/g, '')
                );
              }
            }

            if (trIdx === 1) {
              if (tdIdx === 2) {
                secondPrzwnerCo = Number(
                  $(tdElement)
                    .text()
                    .replace(/[^0-9]/g, '')
                );
              }

              if (tdIdx === 3) {
                secondWinamnt = Number(
                  $(tdElement)
                    .text()
                    .replace(/[^0-9]/g, '')
                );
              }
            }

            if (trIdx === 2) {
              if (tdIdx === 2) {
                thirdPrzwnerCo = Number(
                  $(tdElement)
                    .text()
                    .replace(/[^0-9]/g, '')
                );
              }

              if (tdIdx === 3) {
                thirdWinamnt = Number(
                  $(tdElement)
                    .text()
                    .replace(/[^0-9]/g, '')
                );
              }
            }
          });
      });
      drwNoDate = new Date(
        $drwNoDateInfo.slice(0, 4) + '-' + $drwNoDateInfo.slice(4, 6) + '-' + $drwNoDateInfo.slice(6)
      );

      const statisticInfoList: StatisticDrwNoInterface[] = await getStatisticByDrwNo();

      const highestPrizeInfoList: HighestPrizeDrwNoInterface[] = await getHighestPrizeByYear(drwNoDate);

      const week = 60 * 60 * 24 * 7; // 1WEEK
      // Set Redis ( Lotto Info )
      await redis.set('drwNo', drwNo, 'EX', week);
      await redis.set('drwtNo1', drwtNoList[0].value, 'EX', week);
      await redis.set('drwtNo2', drwtNoList[1].value, 'EX', week);
      await redis.set('drwtNo3', drwtNoList[2].value, 'EX', week);
      await redis.set('drwtNo4', drwtNoList[3].value, 'EX', week);
      await redis.set('drwtNo5', drwtNoList[4].value, 'EX', week);
      await redis.set('drwtNo6', drwtNoList[5].value, 'EX', week);
      await redis.set('bnusNo', drwtNoList[6].value, 'EX', week);
      await redis.set('firstWinamnt', firstWinamnt, 'EX', week);
      await redis.set('firstPrzwnerCo', firstPrzwnerCo, 'EX', week);
      await redis.set('secondWinamnt', secondWinamnt, 'EX', week);
      await redis.set('secondPrzwnerCo', secondPrzwnerCo, 'EX', week);
      await redis.set('thirdWinamnt', thirdWinamnt, 'EX', week);
      await redis.set('thirdPrzwnerCo', thirdPrzwnerCo, 'EX', week);
      await redis.set('drwNoDate', drwNoDate.toString(), 'EX', week);
      // Set Redis ( Lotto Statistic Info )
      await redis.set('firstLottoNo', statisticInfoList[0].lottoNo, 'EX', week);
      await redis.set('firstLottoNoCnt', statisticInfoList[0].cnt, 'EX', week);
      await redis.set('secondLottoNo', statisticInfoList[1].lottoNo, 'EX', week);
      await redis.set('secondLottoNoCnt', statisticInfoList[1].cnt, 'EX', week);
      await redis.set('thirdLottoNo', statisticInfoList[2].lottoNo, 'EX', week);
      await redis.set('thirdLottoNoCnt', statisticInfoList[2].cnt, 'EX', week);
      // Set Redis ( Lotto Highest Prize Info )
      await redis.set(
        'thisYearDrwNo',
        highestPrizeInfoList.length === 2 ? highestPrizeInfoList[1].drwNo : drwNo,
        'EX',
        week
      );
      await redis.set(
        'thisYearFirstWinamnt',
        highestPrizeInfoList.length === 2 ? highestPrizeInfoList[1].firstWinamnt : firstWinamnt,
        'EX',
        week
      );
      await redis.set(
        'thisYearFirstPrzwnerCo',
        highestPrizeInfoList.length === 2 ? highestPrizeInfoList[1].firstPrzwnerCo : firstPrzwnerCo,
        'EX',
        week
      );
      await redis.set(
        'thisYearDrwNoDate',
        highestPrizeInfoList.length === 2 ? highestPrizeInfoList[1].drwNoDate.toString() : drwNoDate.toString(),
        'EX',
        week
      );
      await redis.set('lastYearDrwNo', highestPrizeInfoList[0].drwNo, 'EX', week);
      await redis.set('lastYearFirstWinamnt', highestPrizeInfoList[0].firstWinamnt, 'EX', week);
      await redis.set('lastYearFirstPrzwnerCo', highestPrizeInfoList[0].firstPrzwnerCo, 'EX', week);
      await redis.set('lastYearDrwNoDate', highestPrizeInfoList[0].drwNoDate.toString(), 'EX', week);

      // DB DrwNo Check
      const dbDrwNo: number = await getRecentlyLottoDrwNo();

      if (drwNo !== dbDrwNo) {
        // Set drwInfo DTO
        const drwInfo: LottoDrwInfoDto = {
          drwNo,
          drwtNoList,
          firstWinamnt,
          firstPrzwnerCo,
          secondWinamnt,
          secondPrzwnerCo,
          thirdWinamnt,
          thirdPrzwnerCo,
          drwNoDate,
        };

        // Insert DB
        await insertDrwInfo(drwInfo);
      }
    } catch (err) {
      console.log(err);
    }
  });

export const createSpeettoPrizeInfo = (speettoType: number): SpeettoPrizeInfo => {
  const speettoPrizeInfo: SpeettoPrizeInfo = {
    drwNo: 0,
    speettoType,
    firstPrizeDate: new Date(),
    firstWinAmnt: '',
    firstWinCnt: 0,
    secondPrizeDate: new Date(),
    secondWinAmnt: '',
    secondWinCnt: 0,
    thirdPrizeDate: new Date(),
    thirdWinAmnt: '',
    thirdWinCnt: 0,
    saleDate: new Date(),
    saleRate: 0,
  };

  return speettoPrizeInfo;
};

export const speettoSchedule = (rule: schedule.RecurrenceRule) =>
  scheduleJob(rule, async () => {
    const redis = new ioredis(6379, 'lottery_redis');
    // 스피또 500
    let speetto500Info: SpeettoPrizeInfo = createSpeettoPrizeInfo(500);
    // 스피또 1000
    let speetto1000Info: SpeettoPrizeInfo = createSpeettoPrizeInfo(1000);
    // 스피또 2000
    let speetto2000Info: SpeettoPrizeInfo = createSpeettoPrizeInfo(2000);

    try {
      // Axios
      const response: AxiosResponse = await axios.get(
        'https://m.dhlottery.co.kr/common.do?method=gameInfoAll&wiselog=M_A_1_7',
        { responseType: 'arraybuffer' } // 응답 타입을 arraybuffer로 설정
      );
      // iconv-lite를 사용하여 EUC-KR에서 UTF-8로 디코딩
      const decodedData = iconv.decode(Buffer.from(response.data), 'EUC-KR');
      // Cheerio Crawling
      const $: CheerioAPI = cheerio.load(decodedData);

      $('.slide_item').each((slidItemIdx: number, slidItemElement: Element) => {
        const titleText = $(slidItemElement).find('.section_title h2 span.round.key_clr1 span').text().trim();
        const numbers = titleText.match(/[0-9]+/g);

        if (numbers) {
          // 스피또 정보 생성
          const speettoInfo: SpeettoPrizeInfo = createSpeettoPrizeInfo(Number(numbers[0]));
          // 스피또 당첨 회차 정보
          speettoInfo.drwNo = Number(numbers[1]);
          // 스피또 당첨 테이블 rows
          const rows = $(slidItemElement).find('tr');
          // 스피또 당첨 테이블 rows 순회
          for (let i = 1; i <= 3; i++) {
            const prizeIndex = i - 1;
            const prizeRanking = ['first', 'second', 'third'];

            const prizeDateMatch = $(rows[1])
              .find('td.sp span')
              .eq(i * 2 - 1)
              .text()
              .trim()
              .match(/\((\d{2}-\d{2}-\d{2}) 기준\)/);
            // 스피또 기준 날짜
            if (prizeDateMatch) {
              speettoInfo[`${prizeRanking[prizeIndex]}PrizeDate`] = new Date(`20${prizeDateMatch[1]}`);
            }
            // 스피또 당첨 상금
            speettoInfo[`${prizeRanking[prizeIndex]}WinAmnt`] = $(rows[2]).find('td.sp').eq(prizeIndex).text().trim();
            // 스피또 남은 당첨 매수
            speettoInfo[`${prizeRanking[prizeIndex]}WinCnt`] = Number(
              $(rows[3]).find('td.sp strong').eq(prizeIndex).text().trim().replace(/,/g, '')
            );
          }

          const saleDateMatch = $(rows[5])
            .find('td.sp span')
            .first()
            .text()
            .trim()
            .match(/(\d{2}-\d{2}-\d{2}) 기준/);
          // 스피또 출고 기준 날짜
          if (saleDateMatch) {
            speettoInfo.saleDate = new Date(`20${saleDateMatch[1]}`);
          }
          // 스피또 출고율
          speettoInfo.saleRate = Number($(rows[5]).find('strong.rate').text().trim().replace(/%/g, ''));

          if (numbers[0] === '500') {
            speetto500Info = speettoInfo;
          } else if (numbers[0] === '1000') {
            speetto1000Info = speettoInfo;
          } else if (numbers[0] === '2000') {
            speetto2000Info = speettoInfo;
          }
        }
      });
    } catch (err) {
      console.log(err);
    }

    if (speetto500Info.drwNo !== 0) {
      await redis.set('speetto500Info', JSON.stringify(speetto500Info));

      await insertSpeetoPrizeInfo(speetto500Info);
    }

    if (speetto1000Info.drwNo !== 0) {
      await redis.set('speetto1000Info', JSON.stringify(speetto1000Info));

      await insertSpeetoPrizeInfo(speetto1000Info);
    }

    if (speetto2000Info.drwNo !== 0) {
      await redis.set('speetto2000Info', JSON.stringify(speetto2000Info));

      await insertSpeetoPrizeInfo(speetto2000Info);
    }
  });

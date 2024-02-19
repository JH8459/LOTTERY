import axios, { AxiosResponse } from 'axios';
import ioredis from 'ioredis';
import cheerio, { CheerioAPI, Element } from 'cheerio';
import schedule from 'node-schedule';
import { scheduleJob } from 'node-schedule';
import {
  getHighestPrizeByYear,
  getRecentlyDrwNo,
  getStatisticByDrwNo,
  insertDrwInfo,
} from '../repositories/lotto.repository';
import { DrwtNoInterface, HighestPrizeDrwNoInterface, StatisticDrwNoInterface } from './interface/scheduler.interface';
import { DrwInfoDto } from './dto/drwInfo.dto';

export const lottoSchedule = (rule: schedule.RecurrenceRule) =>
  scheduleJob(rule, async () => {
    console.log('✅ Running At: ', new Date());

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
      const dbDrwNo: number = await getRecentlyDrwNo();

      if (drwNo !== dbDrwNo) {
        // Set drwInfo DTO
        const drwInfo: DrwInfoDto = {
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

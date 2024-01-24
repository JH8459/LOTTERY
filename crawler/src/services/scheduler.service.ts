import axios, { AxiosResponse } from 'axios';
import ioredis from 'ioredis';
import cheerio, { CheerioAPI, Element } from 'cheerio';
import { scheduleJob } from 'node-schedule';
import { getRecentlyDrwNo } from '../repositories/lotto.repository';
import { drwtNo } from './interface/scheduler.interface';

export const lottoSchedule = (rule: string) =>
  scheduleJob(rule, async () => {
    const redis = new ioredis(6379, 'lottery_redis');
    const redisDrwNo = await redis.get('drwNo');

    console.log('✅ redisDrwNo: ', redisDrwNo);

    const recentlyDrwNo: number = await getRecentlyDrwNo();
    let drwNo: number = 0;
    const drwtNoList: drwtNo[] = [];
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

      const recentlyDrwInfo = {
        recentlyDrwNo,
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

      // Set Redis
      const week = 60 * 60 * 24 * 7;
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

      console.log('✅ recentlyDrwNo: ', recentlyDrwNo);
      console.log('✅ drwNo: ', drwNo);
      console.log('✅ drwtNoList: ', drwtNoList);
      console.log('✅ firstWinamnt: ', firstWinamnt);
      console.log('✅ firstPrzwnerCo: ', firstPrzwnerCo);
      console.log('✅ secondWinamnt: ', secondWinamnt);
      console.log('✅ secondPrzwnerCo: ', secondPrzwnerCo);
      console.log('✅ thirdWinamnt: ', thirdWinamnt);
      console.log('✅ thirdPrzwnerCo: ', thirdPrzwnerCo);
      console.log('✅ drwNoDate: ', drwNoDate);
    } catch (err) {
      console.log(err);
    }
  });

import axios, { AxiosResponse } from 'axios';
import cheerio, { CheerioAPI, Element } from 'cheerio';
import { scheduleJob } from 'node-schedule';
import { getRecentlyDrwNo } from '../repositories/lotto.repository';
import { drwtNo } from './interface/scheduler.interface';

export const lottoSchedule = (rule: string) =>
  scheduleJob(rule, async () => {
    const recentlyDrwNo: number = await getRecentlyDrwNo();
    let drwNo: number;
    const drwtNoList: drwtNo[] = [];
    let firstWinamnt: number;
    let firstPrzwnerCo: number;
    let secondWinamnt: number;
    let secondPrzwnerCo: number;
    let thirdWinamnt: number;
    let thirdPrzwnerCo: number;
    let drwNoDate: Date;

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
      const $drwNoDateInfo = $('div.win_result')
        .find('p.desc')
        .text()
        .replace(/[^0-9]/g, '');
      const $drwtNoListInfo = $('div.win_result').children('div.nums').children('div.win');
      const $drwtBonumNoInfo = $('div.win_result').children('div.nums').children('div.bonus').find('span').text();

      // Data Setting
      drwNo = Number($drwNoInfo);
      $drwtNoListInfo.find('span').each((idx: number, el: Element) => {
        drwtNoList.push({ no: `${idx + 1}`, value: Number($(el).text()) });
      });
      drwtNoList.push({ no: 'bonus', value: Number($drwtBonumNoInfo) });
      drwNoDate = new Date(
        $drwNoDateInfo.slice(0, 4) + '-' + $drwNoDateInfo.slice(4, 6) + '-' + $drwNoDateInfo.slice(6)
      );
    } catch (err) {
      console.log(err);
    }
  });

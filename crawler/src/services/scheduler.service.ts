import { scheduleJob } from 'node-schedule';
import { getRecentlyDrwNo } from '../repositories/lotto.repository';

export const lottoSchedule = (rule: string) =>
  scheduleJob(rule, async () => {
    const recentlyDrawNo: number = await getRecentlyDrwNo();

    console.log('1분마다 등장: ', recentlyDrawNo);
  });

import { utilities } from 'nest-winston';
import * as winston from 'winston';
import * as winstonDaily from 'winston-daily-rotate-file';

const dailyOptions = (level: string) => {
  return {
    level,
    datePattern: 'YYYYMMDD',
    dirname: `logs/${level}`,
    filename: `%DATE%_${level}.log`,
    maxFiles: 30, //30일치 로그파일 저장
    zippedArchive: true, // 로그가 쌓이면 압축하여 관리
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      winston.format.printf((info) => `${info.timestamp} [${info.level}] ${info.message}`)
    ),
  };
};

export const WINSTON_CONFIG = {
  transports: [
    new winston.transports.Console({
      level: 'info',
      format: winston.format.combine(utilities.format.nestLike('🍀', { colors: true, prettyPrint: true })),
    }),
    new winstonDaily(dailyOptions('info')),
    new winstonDaily(dailyOptions('error')),
  ],
};

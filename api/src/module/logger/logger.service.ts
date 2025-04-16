import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import * as winstonDaily from 'winston-daily-rotate-file';

/**
 *
 * @description: winston 라이브러리를 활용하여 커스텀된 로그를 출력하는 클래스입니다.
 */
@Injectable()
export class CustomLoggerService implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    // logger format 설정
    const logFormatOption = (colorize?: boolean): winston.Logform.Format =>
      winston.format.combine(
        colorize ? winston.format.colorize({ all: true }) : winston.format.uncolorize(),
        winston.format.timestamp({
          format: 'MM-DD HH:mm:ss',
        }),
        winston.format.printf(({ level, message, timestamp, stack, context }) => {
          return `${timestamp} [${level}]: ${message} ${stack ? stack : ''} ${context ? JSON.stringify(context) : ''}`;
        })
      );

    // logger transport 설정
    const logTransportOption = (level: string) => {
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
          winston.format.printf(({ level, message, timestamp, stack, context }) => {
            return `${timestamp} [${level}]: ${message} ${stack ? stack : ''} ${
              context ? JSON.stringify(context) : ''
            }`;
          })
        ),
      };
    };

    // logger 생성
    this.logger = winston.createLogger({
      level: 'info',
      format: logFormatOption(),
      transports: [
        new winston.transports.Console({
          level: 'info',
          format: winston.format.combine(
            winston.format.colorize({ all: true }),
            winston.format.timestamp({
              format: 'MM-DD HH:mm:ss',
            }),
            winston.format.printf(({ level, message, timestamp, stack, context }) => {
              return `${timestamp} [${level}]: ${message} ${stack ? stack : ''} ${
                context ? JSON.stringify(context) : ''
              }`;
            })
          ),
        }),
        new winstonDaily(logTransportOption('info')),
        new winstonDaily(logTransportOption('warn')),
        new winstonDaily(logTransportOption('error')),
      ],
    });
  }

  async error(message: string, stack?: string, context?: any): Promise<void> {
    this.logger.error(message, { stack, context });
  }

  log(message: string, context?: any): void {
    this.logger.info(message, { context });
  }

  warn(message: string, context?: any): void {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: any): void {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: any): void {
    this.logger.verbose(message, { context });
  }
}

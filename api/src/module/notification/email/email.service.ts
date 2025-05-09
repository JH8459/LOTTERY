import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { lottoEmailTemplate } from './template/lotto.template';
import { convertDateFormat } from 'src/common/utils/utils';
import {
  LottoHighestPrizeInfoInterface,
  LottoInfoInterface,
  LottoStatisticInfoInterface,
} from '../../../common/interface/lotto.interface';
import { InternalServerError } from './error/500.error';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import {
  CustomBadRequestException,
  CustomInternalServerErrorException,
} from 'src/common/custom/exception/exception.service';
import { verificationCodeEmailTemplate } from './template/verification.template';
import { BadRequestError } from './error/400.error';
import { LottoRedisRepository } from 'src/module/redis/repository/lotto.redis.repository';
import { VerificationRedisRepository } from 'src/module/redis/repository/verification.redis.repository';

@Injectable()
export class EmailService {
  private readonly API_EMAIL_FROM: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
    @InjectQueue('emailQueue') private readonly emailQueue: Queue,
    private readonly lottoRedisRepository: LottoRedisRepository,
    private readonly verificationRedisRepository: VerificationRedisRepository
  ) {
    this.API_EMAIL_FROM = this.configService.get<string>('API_EMAIL_FROM');
  }

  /**
   *
   * @param emailInfo 이메일 주소
   * @param verificationCode 인증코드 (선택)
   * @description 로또 당첨 정보 이메일 전송을 위한 작업을 큐에 추가합니다.
   */
  async enqueueLottoEmail(emailInfo: string, verificationCode?: string): Promise<void> {
    if (verificationCode) {
      // 인증코드가 유효한지 확인합니다.
      const validVerificationCode: string = await this.verificationRedisRepository.getVerificationCode(emailInfo);

      if (verificationCode !== validVerificationCode) {
        throw new CustomBadRequestException(BadRequestError.VERIFICATION_CODE_UNMATCH.message);
      }
    }

    // 로또 회차 정보, 통계 정보, 당첨금 정보를 Redis에서 가져옵니다.
    const lottoInfo: LottoInfoInterface = await this.lottoRedisRepository.getRecentlyLottoInfo();
    const lottoStatisticInfo: LottoStatisticInfoInterface =
      await this.lottoRedisRepository.getRecentlyLottoStatisticInfo();
    const lottoHighestPrizeInfo: LottoHighestPrizeInfoInterface =
      await this.lottoRedisRepository.getRecentlyLottoHighestPrizeInfo();

    // 이메일 전송 작업을 위한 옵션을 설정합니다.
    const mailOptions: ISendMailOptions = {
      to: emailInfo,
      from: this.API_EMAIL_FROM,
      subject: `[LOTTERY🍀] ${lottoInfo.drwNo}회 당첨결과 (${convertDateFormat(lottoInfo.drwNoDate)})`,
      html: lottoEmailTemplate(lottoInfo, lottoStatisticInfo, lottoHighestPrizeInfo),
    };

    // 큐에 작업을 추가합니다.
    await this.emailQueue.add('sendEmail', mailOptions, {
      attempts: 3, // 최대 3회 재시도
      backoff: 10000, // 10초 간격으로 재시도
      removeOnComplete: true,
      removeOnFail: false, // 실패한 작업은 남겨서 확인 가능
    });
  }

  /**
   *
   * @param emailInfo 이메일 주소
   * @param verificationCode 인증코드
   * @description 이메일 인증 코드 전송을 위한 작업을 큐에 추가합니다.
   */
  async enqueueVerificationCodeEmail(emailInfo: string, verificationCode: string): Promise<void> {
    const mailOptions: ISendMailOptions = {
      to: emailInfo,
      from: this.API_EMAIL_FROM,
      subject: '[LOTTERY🍀] 이메일 인증 코드',
      html: verificationCodeEmailTemplate(verificationCode),
    };

    // 큐에 작업을 추가합니다.
    await this.emailQueue.add('sendEmail', mailOptions, {
      attempts: 3, // 최대 3회 재시도
      backoff: 10000, // 10초 간격으로 재시도
      removeOnComplete: true,
      removeOnFail: false, // 실패한 작업은 남겨서 확인 가능
    });
  }

  /**
   *
   * @param mailOptions 이메일 전송에 필요한 설정값
   * @description 이메일 전송을 실행합니다.
   */
  async sendLottoEmail(mailOptions: ISendMailOptions): Promise<void> {
    try {
      await this.mailerService.sendMail(mailOptions);
    } catch (err) {
      throw new CustomInternalServerErrorException(InternalServerError.EMAIL_SEND.message);
    }
  }
}

import { MailerAsyncOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-async-options.interface';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const EMAIL_CONFIG: MailerAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    transport: {
      host: configService.get<string>('API_EMAIL_HOST'),
      port: configService.get<number>('API_EMAIL_PORT'),
      from: configService.get<string>('API_EMAIL_FROM'),
      auth: {
        user: configService.get<string>('API_EMAIL_USERNAME'),
        pass: configService.get<string>('API_EMAIL_PASSWORD'),
      },
      tls: {
        rejectUnauthorized: false,
      },
    },
    defaults: {
      from: configService.get<string>('API_EMAIL_FROM'),
    },
  }),
};

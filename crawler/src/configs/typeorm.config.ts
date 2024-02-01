import 'dotenv/config';
import { DataSourceOptions } from 'typeorm';
import { LottoEntity } from '../entities/lotto.entity';

export const TYPE_ORM_CONFIG: DataSourceOptions = {
  type: 'mariadb',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [LottoEntity],
  synchronize: false,
  logging: true,
};

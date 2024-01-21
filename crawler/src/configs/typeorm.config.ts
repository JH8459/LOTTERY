import 'dotenv/config'
import { DataSource } from "typeorm";
import { LottoEntity } from '../entities/lotto.entity';

export const TYPE_ORM_CONFIG = new DataSource({
  "type": "mariadb",
  "host": process.env.DB_HOST,
  "port": Number(process.env.DB_PORT),
  "username": process.env.DB_USER,
  "password": process.env.DB_PASSWORD,
  "database": process.env.DB_DATABASE,
  "entities": [LottoEntity],
  "synchronize": true,
  "logging": true,
})
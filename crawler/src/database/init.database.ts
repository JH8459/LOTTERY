import { DataSource } from 'typeorm';
import { TYPE_ORM_CONFIG } from '../configs/typeorm.config';

export const db = new DataSource(TYPE_ORM_CONFIG);

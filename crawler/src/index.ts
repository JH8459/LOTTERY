import 'dotenv/config';
import express, { Request, Response } from 'express';
import compression from 'compression';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import { indexRouter } from './routes/index.routes';
import { lottoSchedule } from './services/scheduler.service';
import { healthRouter } from './routes/health.routes';
import { DataSource } from 'typeorm';
import { TYPE_ORM_CONFIG } from './configs/typeorm.config';
import { db } from './database/init.database';

// Connect typeORM mariaDB
db.initialize()
  .then(() => {
    console.log('Database Connected :)');
  })
  .catch((error) => console.log(error));

// Create express server
const app = express();

// Middlewares
app.set('port', process.env.CRAWLER_SERVER_PORT);
app.use(compression());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(morgan('dev'));
app.use(
  cors({
    origin: ['*'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

// Routes
app.use('/', indexRouter);
app.use('/health', healthRouter);

// Crawler
// lottoSchedule('0 * * * * *');

app.listen(app.get('port'));

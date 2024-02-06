import 'dotenv/config';
import express from 'express';
import compression from 'compression';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import schedule from 'node-schedule';
import { indexRouter } from './routes/index.routes';
import { lottoSchedule } from './services/scheduler.service';
import { healthRouter } from './routes/health.routes';
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
const rule = new schedule.RecurrenceRule();

rule.dayOfWeek = [0, new schedule.Range(0, 6)];
rule.hour = 4;
rule.minute = 0;
rule.tz = 'Asia/Seoul';

lottoSchedule(rule);

app.listen(app.get('port'));

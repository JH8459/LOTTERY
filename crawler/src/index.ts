import 'dotenv/config';
import express from 'express';
import compression from 'compression';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import schedule from 'node-schedule';
import { indexRouter } from './routes/index.routes';
import { lottoSchedule, speettoSchedule } from './services/scheduler.service';
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

// Lotto Crawler
const lottoRule = new schedule.RecurrenceRule();

lottoRule.dayOfWeek = [0, new schedule.Range(0, 6)];
lottoRule.hour = 3;
lottoRule.minute = 0;
lottoRule.tz = 'Asia/Seoul';

lottoSchedule(lottoRule);

// Speetto Crawler
const speettoRule = new schedule.RecurrenceRule();
speettoRule.dayOfWeek = [0, new schedule.Range(0, 6)];

// speettoRule.hour = 3;
// speettoRule.minute = 0;
speettoRule.second = 0;
speettoRule.tz = 'Asia/Seoul';

speettoSchedule(speettoRule);

app.listen(app.get('port'));

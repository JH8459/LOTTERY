import 'dotenv/config';
import express, { Request, Response } from 'express';
import compression from 'compression';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import { TYPE_ORM_CONFIG } from './configs/typeorm.config';

// Connect typeORM mariaDB
TYPE_ORM_CONFIG.initialize()
  .then(() => {
    console.log('Database Connected :)');
  })
  .catch((error) => console.log(error));

// Create express server
const app = express();

// middlewares
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

app.get('/', (req: Request, res: Response) => {
  console.log('WELCOME ✅');
  res.send('WELCOME');
});

app.get('/health', (req: Request, res: Response) => {
  console.log('HEALTHY 💪');
  res.send(new Date());
});

app.listen(app.get('port'));

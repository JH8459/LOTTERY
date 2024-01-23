import express, { Request, Response } from 'express';

export const indexRouter = express.Router();

indexRouter.get('/', (req: Request, res: Response) => {
  console.log('WELCOME ✅');
  res.send('WELCOME');
});

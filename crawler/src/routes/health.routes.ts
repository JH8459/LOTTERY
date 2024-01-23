import express, { Request, Response } from 'express';

export const healthRouter = express.Router();

healthRouter.get('/', (req: Request, res: Response) => {
  console.log('HEALTHY 💪');
  res.send(new Date());
});

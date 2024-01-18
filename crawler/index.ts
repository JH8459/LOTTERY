import express, { Request, Response } from "express";

const app = express();

app.get("/", (req: Request, res: Response) => {
  console.log('WELCOME ✅')
  res.send('HI');
});

app.get("/health", (req: Request, res: Response) => {
  console.log('HEALTHY 💪')
  res.send(new Date());
});

app.listen(3000)
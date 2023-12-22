import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';

dotenv.config();

const app = express();


const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

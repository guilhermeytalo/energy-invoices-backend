import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import router from './routes/routes';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/test', (req: Request, res: Response, next: NextFunction) => {
  res.send('Hello World!');
});

app.use('/', router);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

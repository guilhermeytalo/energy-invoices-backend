import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import invoiceRoutes from './routes/invoiceRoutes';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Hello World!');
});

app.use('/invoices', invoiceRoutes);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

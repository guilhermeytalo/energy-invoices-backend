import express, { Request, Response } from 'express';
import { getInvoices, uploadInvoice } from '../services/invoice.service';
import { parsePDF } from '../controllers/invoiceController';
import { getDashboardData } from '../services/dashboard.service';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb
  },
});

router.get('/dashboard', getDashboardData);

router.post(
  '/upload',
  upload.array('invoices'),
  async (req: Request, res: Response) => {
    try {
      const files = req.files as Express.Multer.File[];
      console.log('files', files);

      const parsedDataPromises = files.map(async (file) => await parsePDF(file.buffer, file.originalname));
      console.log('parsedDataPromises', parsedDataPromises);

      const parsedDataArray = await Promise.all(parsedDataPromises);
      console.log('parsedDataArray', parsedDataArray);
      
      const savedInvoicesPromises = parsedDataArray.map(async data => {
        const invoiceData = {
          clientNumber: data.text.cliente,
          invoiceMonthDate: data.text.referente,
          eletricEnergy: data.text.energiaEletrica,
          sceeEnergy: data.text.sceeICMS,
          compensedEnergy: data.text.energiaCompensada,
          contrivutionIlumination: data.text.contribIlumPublica,
        };
        await prisma.invoices.create({ data: invoiceData });
      });
      
      console.log('savedInvoicesPromises', savedInvoicesPromises);
      const savedInvoices = await Promise.all(savedInvoicesPromises);

      res.status(200).json(savedInvoices);
    } catch (error) {
      console.error('Error parsing uploaded file:', error);
      res.status(400).json({ error: 'Failed to parse uploaded file' });
    }
  }
);

router.get('/invoices', async (req: Request, res: Response) => {
  try {
    const invoices = await prisma.invoices.findMany();
    res.status(200).json(invoices);
  } catch (error) {
    console.error('Error retrieving invoices:', error);
    res.status(400).json({ error: 'Failed to retrieve invoices' });
  }
});

router.get('/invoices/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const invoice = await prisma.invoices.findUnique({ where: { id } });
    res.status(200).json(invoice);
  } catch (error) {
    console.error('Error retrieving invoice:', error);
    res.status(400).json({ error: 'Failed to retrieve invoice' });
  }
});

export default router;

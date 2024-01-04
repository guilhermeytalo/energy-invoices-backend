import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';
import multer from 'multer';
import { getDashboardData } from '../services/dashboard.service';
import { getInvoices, uploadInvoice } from '../services/invoice.service';

const router = express.Router();
const prisma = new PrismaClient();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.get('/dashboard', getDashboardData);

router.post('/upload', upload.array('invoices'), uploadInvoice);

router.get('/invoices', getInvoices);

router.get('/invoices/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const invoice = await prisma.invoice.findUnique({ 
      where: { id },
      include: {
        eletricenergyidToinvoiceentry: true,
        energysceeidToinvoiceentry: true,
        compensedenergyidToinvoiceentry: true,
      },
    });
    res.status(200).json(invoice);
  } catch (error) {
    console.error('Error retrieving invoice:', error);
    res.status(400).json({ error: 'Failed to retrieve invoice' });
  }
});

export default router;

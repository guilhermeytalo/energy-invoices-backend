import { PrismaClient } from '@prisma/client';
import express from 'express';
import multer from 'multer';
import { getDashboardData } from '../services/dashboard.service';
import { getInvoiceById, getInvoices, uploadInvoice } from '../services/invoice.service';

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

router.get('/invoices/:id', getInvoiceById);

export default router;

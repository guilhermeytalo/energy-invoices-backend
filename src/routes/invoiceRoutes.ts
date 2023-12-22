import express from 'express';
import { getInvoices } from '../controllers/invoiceController';

const router = express.Router();

router.get('/getInvoices', getInvoices);

export default router;
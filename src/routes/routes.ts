import express from 'express';
import { getInvoices, uploadInvoice } from '../services/invoice.service';
import { getDashboardData } from '../services/dashboard.service';
import multer from 'multer';

const router = express.Router();
const uploadStorage = multer({ dest: 'src/assets/invoices' });

router.get('/invoices', getInvoices);
router.get('/dashboard', getDashboardData);
router.post('/upload', uploadStorage.single('invoice'), uploadInvoice);

export default router;
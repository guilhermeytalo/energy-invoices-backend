import express from 'express';
import { getInvoices } from '../services/invoice.service';
import { getDashboardData } from '../services/dashboard.service';

const router = express.Router();

router.get('/invoices', getInvoices);
router.get('/dashboard', getDashboardData);

export default router;
import express from 'express';
import { getInvoices } from '../services/invoice.service';
import { dashboard } from '../services/dashboard.service';


const router = express.Router();

router.get('/invoices', getInvoices);
router.get('/dashboard', dashboard);

export default router;
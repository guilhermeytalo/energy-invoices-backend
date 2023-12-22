import express from 'express';
import { getInvoices } from '../services/invoice.service';


const router = express.Router();

router.get('/getInvoices', getInvoices);

export default router;
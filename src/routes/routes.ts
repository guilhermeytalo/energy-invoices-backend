import express from 'express';
import { getInvoices, uploadInvoice } from '../services/invoice.service';
import multer from 'multer';


const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/invoices', getInvoices);
router.post('/invoices', upload.single('invoice'), uploadInvoice);
export default router;
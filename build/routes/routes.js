"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const invoice_service_1 = require("../services/invoice.service");
const dashboard_service_1 = require("../services/dashboard.service");
const multer_1 = __importDefault(require("multer"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // no larger than 5mb
    },
});
router.get('/invoices', invoice_service_1.getInvoices);
router.get('/dashboard', dashboard_service_1.getDashboardData);
// router.post('/upload', );
router.post('/upload', upload.array('invoices'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const files = req.files;
        const parsedDataPromises = files.map(file => parsePDF(file.path));
        const parsedDataArray = yield Promise.all(parsedDataPromises);
        const savedInvoicesPromises = parsedDataArray
            .map(data => prisma.invoices.create({ data }));
        console.log('savedInvoicesPromises', savedInvoicesPromises);
        const savedInvoices = yield Promise.all(savedInvoicesPromises);
        res.status(200).json(savedInvoices);
    }
    catch (error) {
        console.error('Error parsing uploaded file:', error);
        res.status(400).json({ error: 'Failed to parse uploaded file' });
    }
}));
router.get('/invoices', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const invoices = yield prisma.invoices.findMany();
        res.status(200).json(invoices);
    }
    catch (error) {
        console.error('Error retrieving invoices:', error);
        res.status(400).json({ error: 'Failed to retrieve invoices' });
    }
}));
router.get('/invoices/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const invoice = yield prisma.invoices.findUnique({ where: { id } });
        res.status(200).json(invoice);
    }
    catch (error) {
        console.error('Error retrieving invoice:', error);
        res.status(400).json({ error: 'Failed to retrieve invoice' });
    }
}));
exports.default = router;

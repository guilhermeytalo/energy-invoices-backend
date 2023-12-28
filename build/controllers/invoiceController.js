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
exports.parsePDF = void 0;
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // no larger than 5mb
    },
});
const parsePDF = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pdfFile = fs_1.default.readFileSync(filePath);
        const data = yield (0, pdf_parse_1.default)(pdfFile);
        const text = data.text;
        const regexPatterns = {
            cliente: /Nº DA INSTALAÇÃO\s+(\d+)/,
            referente: /Valor a pagar \(R\$\)\s+(\w+\/\d+)/,
            energiaEletrica: /Energia ElétricakWh(.*?)\n/,
            sceeICMS: /Energia SCEE s\/ ICMSkWh(.*?)\n/,
            energiaCompensada: /Energia compensada GD IkWh(.*?)\n/,
            contribIlumPublica: /Contrib Ilum Publica Municipal(.*?)\n/,
        };
        const extractValue = (pattern) => {
            const match = text.match(pattern);
            return match ? match[1].trim() : null;
        };
        const extractedData = {
            fileName: filePath,
            numPages: data.numpages,
            text: {
                cliente: extractValue(regexPatterns.cliente),
                referente: extractValue(regexPatterns.referente),
                energiaEletrica: extractValue(regexPatterns.energiaEletrica),
                sceeICMS: extractValue(regexPatterns.sceeICMS),
                energiaCompensada: extractValue(regexPatterns.energiaCompensada),
                contribIlumPublica: extractValue(regexPatterns.contribIlumPublica),
            },
        };
        return extractedData;
    }
    catch (error) {
        console.error(`Error parsing ${filePath}:`, error);
        return {
            fileName: filePath,
            numPages: 0,
            text: {
                cliente: null,
                referente: null,
                energiaEletrica: null,
                sceeICMS: null,
                energiaCompensada: null,
                contribIlumPublica: null,
            },
        };
    }
});
exports.parsePDF = parsePDF;
router.post('/upload', upload.array('invoices'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const files = req.files;
        const parsedDataPromises = files.map(file => (0, exports.parsePDF)(file.path));
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

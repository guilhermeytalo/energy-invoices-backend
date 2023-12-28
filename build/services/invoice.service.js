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
exports.uploadInvoice = exports.getInvoices = void 0;
const fs_1 = __importDefault(require("fs"));
const invoiceController_1 = require("../controllers/invoiceController");
const getInvoices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const directoryPath = './src/assets/invoices';
        const files = fs_1.default.readdirSync(directoryPath);
        const parsedDataPromises = files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
            const filePath = `${directoryPath}/${file}`;
            return yield (0, invoiceController_1.parsePDF)(filePath);
        }));
        const parsedData = yield Promise.all(parsedDataPromises);
        res.status(200).json(parsedData);
    }
    catch (error) {
        console.error('Error getting invoices:', error);
        res.status(400).json({ error: 'Failed to retrieve invoices' });
    }
});
exports.getInvoices = getInvoices;
const uploadInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const parsedData = yield (0, invoiceController_1.parsePDF)((_b = (_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.path) !== null && _b !== void 0 ? _b : '');
        res.status(200).json(parsedData);
    }
    catch (error) {
        console.error('Error parsing uploaded file:', error);
        res.status(400).json({ error: 'Failed to parse uploaded file' });
    }
});
exports.uploadInvoice = uploadInvoice;

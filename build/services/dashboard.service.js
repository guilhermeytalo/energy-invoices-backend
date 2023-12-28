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
exports.getDashboardData = void 0;
const fs_1 = __importDefault(require("fs"));
const invoiceController_1 = require("../controllers/invoiceController");
const getDashboardData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const directoryPath = './src/assets/invoices';
        const files = fs_1.default.readdirSync(directoryPath);
        const parsedDataPromises = files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
            const filePath = `${directoryPath}/${file}`;
            return yield (0, invoiceController_1.parsePDF)(filePath);
        }));
        const parsedData = yield Promise.all(parsedDataPromises);
        const dashboardData = parsedData.map((data) => {
            const energiaEletricaValues = (data.text.energiaEletrica || '').replace(/,/g, '.').split(' ').map(Number);
            const sceeICMSValues = (data.text.sceeICMS || '').replace(/,/g, '.').split(' ').map(Number);
            const energiaEletrica = energiaEletricaValues.reduce((a, b) => a + b, 0);
            const sceeICMS = sceeICMSValues.reduce((a, b) => a + b, 0);
            console.log('values?', energiaEletrica, sceeICMS);
            const energiaCompensada = parseFloat(data.text.energiaCompensada || '0');
            const contribIlumPublica = parseFloat(data.text.contribIlumPublica || '0');
            const totalEnergyConsume = energiaEletrica + sceeICMS;
            const valorTotalSemGD = energiaEletrica + sceeICMS + contribIlumPublica;
            const economiaGD = energiaCompensada;
            return Object.assign(Object.assign({}, data), { totalEnergyConsume, energiaCompensadaGDI: energiaCompensada, valorTotalSemGD,
                economiaGD });
        });
        res.status(200).json(dashboardData);
    }
    catch (error) {
        console.error('Error getting dashboard data:', error);
        res.status(400).json({ error: 'Failed to retrieve dashboard data' });
    }
});
exports.getDashboardData = getDashboardData;

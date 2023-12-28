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
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const invoice_service_1 = require("../invoice.service");
(0, vitest_1.describe)('InvoiceService', () => {
    const mockData = [
        {
            fileName: '3000055479-06-2023.pdf',
            numPages: 1,
            text: {
                cliente: '7005400387',
                referente: 'JUN/2023',
                energiaEletrica: '50  0,86613683        43,28 0,67479161',
                sceeICMS: '1.007  0,64802788       652,55 0,61569129',
                energiaCompensada: '1.007  0,61569129      -620,00 0,61569129',
                contribIlumPublica: '49,43',
            },
        },
    ];
    (0, vitest_1.test)('Should be possible to retrieve all invoices', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = {};
        const res = {
            status: (code) => {
                return {
                    json: (data) => {
                        (0, vitest_1.expect)(code).toBe(200);
                        (0, vitest_1.expect)(data).toBe(mockData);
                    },
                };
            },
            json: (data) => {
                (0, vitest_1.expect)(data).toBe(mockData);
            },
        };
        yield (0, invoice_service_1.getInvoices)(req, res);
        (0, vitest_1.expect)(res.status).toBeCalledWith(200);
        (0, vitest_1.expect)(res.json).toBeCalledWith(mockData);
    }));
});

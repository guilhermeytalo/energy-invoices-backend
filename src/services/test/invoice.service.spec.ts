import { test, expect, describe } from 'vitest';
import { getInvoices } from '../invoice.service';
import { Request, Response } from 'express';
describe('InvoiceService', () => {
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
  test('Should be possible to retrieve all invoices', async () => {
    const req = {} as Request;
    const res = {
      status: (code: number) => {
        return {
          json: (data: any) => {
            expect(code).toBe(200);
            expect(data).toBe(mockData);
          },
        };
      },
      json: (data: []) => {
        expect(data).toBe(mockData);
      },
    } as unknown as Response;
    await getInvoices(req, res);
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith(mockData);
  });
});

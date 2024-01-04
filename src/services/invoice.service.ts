import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { parsePDF } from '../controllers/invoiceController';

const prisma = new PrismaClient();

export const getInvoices = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const invoices = await prisma.invoice.findMany();
    res.status(200).json(invoices);
  } catch (error) {
    console.error('Error retrieving invoices:', error);
    res.status(400).json({ error: 'Failed to retrieve invoices' });
  }
};

export const getInvoiceById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        eletricenergyidToinvoiceentry: true,
        energysceeidToinvoiceentry: true,
        compensedenergyidToinvoiceentry: true,
      },
    });
    res.status(200).json(invoice);
  } catch (error) {
    console.error('Error retrieving invoice:', error);
    res.status(400).json({ error: 'Failed to retrieve invoice' });
  }
};

export const uploadInvoice = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];

    const parsedDataPromises = files.map(
      async (file) => await parsePDF(file.buffer, file.originalname)
    );

    const parsedDataArray = await Promise.all(parsedDataPromises);

    const savedInvoicesPromises = parsedDataArray.map(async (data) => {
      const eletricEnergy = await prisma.invoiceentry.create({
        data: {
          quant: data.text.energiaEletrica.quant,
          unitprice: data.text.energiaEletrica.unitPrice,
          value: data.text.energiaEletrica.value,
          unittax: data.text.energiaEletrica.unitTax,
        },
      });
      const sceeEnergy = await prisma.invoiceentry.create({
        data: {
          quant: data.text.sceeICMS.quant,
          unitprice: data.text.sceeICMS.unitPrice,
          value: data.text.sceeICMS.value,
          unittax: data.text.sceeICMS.unitTax,
        },
      });
      const compensedEnergy = await prisma.invoiceentry.create({
        data: {
          quant: data.text.energiaCompensada.quant,
          unitprice: data.text.energiaCompensada.unitPrice,
          value: data.text.energiaCompensada.value,
          unittax: data.text.energiaCompensada.unitTax,
        },
      });

      const invoiceData = {
        clientnumber: data.text.cliente,
        invoicemonthdate: data.text.referente,
        eletricenergyid: eletricEnergy.id,
        energysceeid: sceeEnergy.id,
        compensedenergyid: compensedEnergy.id,
        contributionilumination: data.text.contribIlumPublica,
      };

      await prisma.invoice.create({ data: invoiceData });

      return 'Invoice created successfully';
    });

    const savedInvoices = await Promise.all(savedInvoicesPromises);

    res.status(200).json(savedInvoices);
  } catch (error) {
    console.error('Error parsing uploaded file:', error);
    res.status(400).json({ error: 'Failed to parse uploaded file' });
  }
};

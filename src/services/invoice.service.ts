import { Request, Response } from 'express';
import fs from 'fs';
import { parsePDF } from '../controllers/invoiceController';
export const getInvoices = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const directoryPath = './src/assets/invoices';
    const files = fs.readdirSync(directoryPath);

    const parsedDataPromises = files.map(async (file) => {
      const filePath = `${directoryPath}/${file}`;
      return await parsePDF(filePath);
    });

    const parsedData = await Promise.all(parsedDataPromises);
    res.status(200).json(parsedData);
  } catch (error) {
    console.error('Error getting invoices:', error);
    res.status(400).json({ error: 'Failed to retrieve invoices' });
  }
};

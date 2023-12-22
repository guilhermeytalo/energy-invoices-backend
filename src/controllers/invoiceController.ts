import { Request, Response } from 'express';
import fs from 'fs';
import pdfParser from 'pdf-parse';

const parsePDF = async (filePath: any) => {
  try {
    const pdfFile = fs.readFileSync(filePath);
    const data = await pdfParser(pdfFile);
    return { fileName: filePath, numPages: data.numpages, text: data.text };
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error);
    return { fileName: filePath, error: true };
  }
};

export const getInvoices = async (req: Request, res: Response) => {
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
    res.status(500).json({ error: 'Failed to retrieve invoices' });
  }
};

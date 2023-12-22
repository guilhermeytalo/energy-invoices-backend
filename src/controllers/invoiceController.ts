import { Request, Response } from 'express';
import fs from 'fs';
import pdfParser from 'pdf-parse';

interface ExtractedData {
  fileName: string;
  numPages: number;
  text: {
    cliente: string | null;
    referente: string | null;
    energiaEletrica: string | null;
    sceeICMS: string | null;
    energiaCompensada: string | null;
    contribIlumPublica: string | null;
    // Add more properties as needed
  };
}

const parsePDF = async (filePath: string): Promise<ExtractedData> => {
  try {
    const pdfFile = fs.readFileSync(filePath);
    const data = await pdfParser(pdfFile);
    const text = data.text; // Extracted text from PDF

    // Define regular expressions to match specific patterns
    const regexPatterns: Record<string, RegExp> = {
      cliente: /Nº DO CLIENTE\s*(\d+)/,
      referente: /Referente a\s+(\w+\/\d+)/,
      energiaEletrica: /Energia ElétricakWh(.*?)\n/,
      sceeICMS: /Energia SCEE s\/ ICMSkWh(.*?)\n/,
      energiaCompensada: /Energia compensada GD IkWh(.*?)\n/,
      contribIlumPublica: /Contrib Ilum Publica Municipal(.*?)\n/,
      // Add more patterns for other properties as needed
    };

    
    // Function to extract value based on regex pattern
    const extractValue = (pattern: RegExp): string | null => {
      const match = text.match(pattern);
      return match ? match[1].trim() : null;
    };


    // Extract values using defined patterns
    const extractedData: ExtractedData = {
      fileName: filePath,
      numPages: data.numpages,
      text: {
        cliente: extractValue(regexPatterns.cliente),
        referente: extractValue(regexPatterns.referente),
        energiaEletrica: extractValue(regexPatterns.energiaEletrica),
        sceeICMS: extractValue(regexPatterns.sceeICMS),
        energiaCompensada: extractValue(regexPatterns.energiaCompensada),
        contribIlumPublica: extractValue(regexPatterns.contribIlumPublica),
        // Add more properties here based on the defined patterns
      },
    };
    console.log('regexPatterns:', extractedData);

    return extractedData;
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error);
    return { fileName: filePath, numPages: 0, text: {
      cliente: null,
      referente: null,
      energiaEletrica: null,
      sceeICMS: null,
      energiaCompensada: null,
      contribIlumPublica: null,
      // Add more properties here based on the defined patterns
    } };
  }
};

export const getInvoices = async (req: Request, res: Response): Promise<void> => {
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

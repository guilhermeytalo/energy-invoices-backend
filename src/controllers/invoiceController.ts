import fs from 'fs';
import multer from 'multer';
import pdfParser from 'pdf-parse';
import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();


interface ExtractedData {
  fileName: string;
  numPages: number;
  text: {
    cliente: string;
    referente: string;
    energiaEletrica: string;
    sceeICMS: string;
    energiaCompensada: string;
    contribIlumPublica: string;
  };
}

export const parsePDF = async (fileBuffer: Buffer, fileName: string): Promise<ExtractedData> => {
  try {
    const pdfFile = fs.readFileSync(fileBuffer);
    const data = await pdfParser(pdfFile);
    const text = data.text;

    const regexPatterns: Record<string, RegExp> = {
      cliente: /Nº DA INSTALAÇÃO\s+(\d+)/,
      referente: /Valor a pagar \(R\$\)\s+(\w+\/\d+)/,
      energiaEletrica: /Energia ElétricakWh(.*?)\n/,
      sceeICMS: /Energia SCEE s\/ ICMSkWh(.*?)\n/,
      energiaCompensada: /Energia compensada GD IkWh(.*?)\n/,
      contribIlumPublica: /Contrib Ilum Publica Municipal(.*?)\n/,
    };

    const extractValue = (pattern: RegExp): string | null => {
      const match = text.match(pattern);
      return match ? match[1].trim() : null;
    };

    const extractedData: ExtractedData = {
      fileName: fileName,
      numPages: data.numpages,
      text: {
        cliente: extractValue(regexPatterns.cliente)!,
        referente: extractValue(regexPatterns.referente)!,
        energiaEletrica: extractValue(regexPatterns.energiaEletrica)!,
        sceeICMS: extractValue(regexPatterns.sceeICMS)!,
        energiaCompensada: extractValue(regexPatterns.energiaCompensada)!,
        contribIlumPublica: extractValue(regexPatterns.contribIlumPublica)!,
      },
    };

    return extractedData;
  } catch (error) {
    console.error(`Error parsing ${fileName}:`, error);
    return {
      fileName: fileName,
      numPages: 0,
      text: {
        cliente: '',
        referente: '',
        energiaEletrica: '',
        sceeICMS: '',
        energiaCompensada: '',
        contribIlumPublica: '',
      },
    };
  }
};



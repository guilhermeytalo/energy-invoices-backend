import pdfParser from 'pdf-parse';
import { ExtractedData } from '../utils/interfaces';

export const parsePDF = async (
  fileBuffer: Buffer,
  fileName: string
): Promise<ExtractedData> => {
  try {
    const data = await pdfParser(fileBuffer);
    console.log('data', data);
    const text = data.text;

    const regexPatterns: Record<string, RegExp> = {
      cliente: /Nº DA INSTALAÇÃO\s+(\d+)/,
      referente: /Valor a pagar \(R\$\)\s+(\w+\/\d+)/,
      energiaEletrica: /Energia ElétricakWh(.*?)\n/,
      sceeICMS: /Energia SCEE s\/ ICMSkWh(.*?)\n/,
      energiaCompensada: /Energia compensada GD IkWh(.*?)\n/,
      contribIlumPublica: /Contrib Ilum Publica Municipal(.*?)\n/,
    };

    const extractValue = (pattern: RegExp): string[] | null => {
      const match = text.match(pattern);
      return match ? match[1].trim().split(/\s+/) : null;
    };

    const extractedData: ExtractedData = {
      fileName: fileName,
      numPages: data.numpages,
      text: {
        cliente: extractValue(regexPatterns.cliente)![0],
        referente: extractValue(regexPatterns.referente)![0],
        energiaEletrica: {
          quant: extractValue(regexPatterns.energiaEletrica)![0],
          unitPrice: extractValue(regexPatterns.energiaEletrica)![1],
          value: extractValue(regexPatterns.energiaEletrica)![2],
          unitTax: extractValue(regexPatterns.energiaEletrica)![3],
        },
        sceeICMS: {
          quant: extractValue(regexPatterns.sceeICMS)![0],
          unitPrice: extractValue(regexPatterns.sceeICMS)![1],
          value: extractValue(regexPatterns.sceeICMS)![2],
          unitTax: extractValue(regexPatterns.sceeICMS)![3],
        },
        energiaCompensada: {
          quant: extractValue(regexPatterns.energiaCompensada)![0],
          unitPrice: extractValue(regexPatterns.energiaCompensada)![1],
          value: extractValue(regexPatterns.energiaCompensada)![2],
          unitTax: extractValue(regexPatterns.energiaCompensada)![3],
        },
        contribIlumPublica: extractValue(regexPatterns.contribIlumPublica)![0],
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
        energiaEletrica: {
          quant: '',
          unitPrice: '',
          value: '',
          unitTax: '',
        },
        sceeICMS: {
          quant: '',
          unitPrice: '',
          value: '',
          unitTax: '',
        },
        energiaCompensada: {
          quant: '',
          unitPrice: '',
          value: '',
          unitTax: '',
        },
        contribIlumPublica: '',
      },
    };
  }
};

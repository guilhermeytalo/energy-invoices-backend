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
  };
}

export const parsePDF = async (filePath: string): Promise<ExtractedData> => {
  try {
    const pdfFile = fs.readFileSync(filePath);
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
      fileName: filePath,
      numPages: data.numpages,
      text: {
        cliente: extractValue(regexPatterns.cliente),
        referente: extractValue(regexPatterns.referente),
        energiaEletrica: extractValue(regexPatterns.energiaEletrica),
        sceeICMS: extractValue(regexPatterns.sceeICMS),
        energiaCompensada: extractValue(regexPatterns.energiaCompensada),
        contribIlumPublica: extractValue(regexPatterns.contribIlumPublica),
      },
    };

    return extractedData;
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error);
    return {
      fileName: filePath,
      numPages: 0,
      text: {
        cliente: null,
        referente: null,
        energiaEletrica: null,
        sceeICMS: null,
        energiaCompensada: null,
        contribIlumPublica: null,
      },
    };
  }
};

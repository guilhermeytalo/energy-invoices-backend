export interface ExtractedData {
    fileName: string;
    numPages: number;
    text: {
      cliente: string;
      referente: string;
      energiaEletrica: {
        quant: string;
        unitPrice: string;
        value: string;
        unitTax: string;
      };
      sceeICMS: {
        quant: string;
        unitPrice: string;
        value: string;
        unitTax: string;
      };
      energiaCompensada: {
        quant: string;
        unitPrice: string;
        value: string;
        unitTax: string;
      };
      contribIlumPublica: string;
    };
  }
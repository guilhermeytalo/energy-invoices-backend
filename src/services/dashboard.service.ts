import { Request, Response } from 'express';
import fs from 'fs';
import { parsePDF } from '../controllers/invoiceController';
export const getDashboardData = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const directoryPath = './src/assets/invoices';
    const files = fs.readdirSync(directoryPath);

    // const parsedDataPromises = files.map(async (file) => {
    //   const filePath = `${directoryPath}/${file}`;
    //   return await parsePDF(filePath);
    // });

    // const parsedData = await Promise.all(parsedDataPromises);
    // const dashboardData = parsedData.map((data) => {
    //     const energiaEletricaValues = (data.text.energiaEletrica || '').replace(/,/g, '.').split(' ').map(Number);
    //     const sceeICMSValues = (data.text.sceeICMS || '').replace(/,/g, '.').split(' ').map(Number);
  
    //     const energiaEletrica = energiaEletricaValues.reduce((a, b) => a + b, 0);
    //     const sceeICMS = sceeICMSValues.reduce((a, b) => a + b, 0);
    //   console.log('values?', energiaEletrica, sceeICMS);

    //   const energiaCompensada = parseFloat(data.text.energiaCompensada || '0');
    //   const contribIlumPublica = parseFloat(
    //     data.text.contribIlumPublica || '0'
    //   );

    //   const totalEnergyConsume = energiaEletrica + sceeICMS;

    //   const valorTotalSemGD = energiaEletrica + sceeICMS + contribIlumPublica;
    //   const economiaGD = energiaCompensada;

    //   return {
    //     ...data,
    //     totalEnergyConsume,
    //     energiaCompensadaGDI: energiaCompensada,
    //     valorTotalSemGD,
    //     economiaGD,
    //   };
    // });

    // res.status(200).json(dashboardData);
  } catch (error) {
    console.error('Error getting dashboard data:', error);
    res.status(400).json({ error: 'Failed to retrieve dashboard data' });
  }
};

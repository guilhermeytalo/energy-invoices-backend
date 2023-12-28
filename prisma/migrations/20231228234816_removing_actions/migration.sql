-- DropForeignKey
ALTER TABLE "invoice" DROP CONSTRAINT "invoice_eletricenergyid_fkey";

-- AddForeignKey
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_eletricenergyid_fkey" FOREIGN KEY ("eletricenergyid") REFERENCES "invoiceentry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

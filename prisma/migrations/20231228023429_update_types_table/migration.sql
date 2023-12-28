-- DropIndex
DROP INDEX "Invoices_clientNumber_key";

-- AlterTable
ALTER TABLE "Invoices" ALTER COLUMN "invoiceMonthDate" SET DATA TYPE TEXT,
ALTER COLUMN "eletricEnergy" SET DATA TYPE TEXT;

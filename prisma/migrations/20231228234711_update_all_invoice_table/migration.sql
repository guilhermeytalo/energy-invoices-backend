/*
  Warnings:

  - You are about to drop the `Invoices` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Invoices";

-- CreateTable
CREATE TABLE "invoice" (
    "id" SERIAL NOT NULL,
    "clientnumber" VARCHAR(255) NOT NULL,
    "invoicemonthdate" VARCHAR(255) NOT NULL,
    "eletricenergyid" INTEGER NOT NULL,
    "contributionilumination" VARCHAR(255) NOT NULL,
    "createdat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoiceentry" (
    "id" SERIAL NOT NULL,
    "quant" VARCHAR(255) NOT NULL,
    "unitprice" VARCHAR(255) NOT NULL,
    "value" VARCHAR(255) NOT NULL,
    "unittax" VARCHAR(255) NOT NULL,

    CONSTRAINT "invoiceentry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_eletricenergyid_fkey" FOREIGN KEY ("eletricenergyid") REFERENCES "invoiceentry"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- CreateTable
CREATE TABLE "Dashboard" (
    "id" SERIAL NOT NULL,
    "consume" TEXT NOT NULL,
    "compensedEnergy" TEXT NOT NULL,
    "totalValueWGd" TEXT NOT NULL,
    "sceeEnergyWIcms" TEXT NOT NULL,
    "economyGd" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Dashboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice" (
    "id" SERIAL NOT NULL,
    "clientnumber" VARCHAR(255) NOT NULL,
    "invoicemonthdate" VARCHAR(255) NOT NULL,
    "contributionilumination" VARCHAR(255) NOT NULL,
    "eletricenergyid" INTEGER NOT NULL,
    "energysceeid" INTEGER NOT NULL,
    "compensedenergyid" INTEGER NOT NULL,
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
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_eletricenergyid_fkey" FOREIGN KEY ("eletricenergyid") REFERENCES "invoiceentry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_energysceeid_fkey" FOREIGN KEY ("energysceeid") REFERENCES "invoiceentry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_compensedenergyid_fkey" FOREIGN KEY ("compensedenergyid") REFERENCES "invoiceentry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

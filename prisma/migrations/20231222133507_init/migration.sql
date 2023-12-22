-- CreateTable
CREATE TABLE "Invoices" (
    "id" SERIAL NOT NULL,
    "clientNumber" TEXT NOT NULL,
    "invoiceMonthDate" TIMESTAMP(3) NOT NULL,
    "eletricEnergy" TIMESTAMP(3) NOT NULL,
    "sceeEnergy" TEXT NOT NULL,
    "compensedEnergy" TEXT NOT NULL,
    "contrivutionIlumination" TEXT NOT NULL,

    CONSTRAINT "Invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dashboard" (
    "id" SERIAL NOT NULL,
    "consume" TEXT NOT NULL,
    "compensedEnergy" TEXT NOT NULL,
    "totalValueWGd" TEXT NOT NULL,
    "sceeEnergyWIcms" TEXT NOT NULL,
    "economyGd" TEXT NOT NULL,

    CONSTRAINT "Dashboard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invoices_clientNumber_key" ON "Invoices"("clientNumber");

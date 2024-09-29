/*
  Warnings:

  - Added the required column `sedeId` to the `ReservaLaboratorioAbierto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sedeId` to the `ReservaLaboratorioCerrado` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ReservaLaboratorioAbierto" ADD COLUMN     "sedeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ReservaLaboratorioCerrado" ADD COLUMN     "sedeId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ReservaLaboratorioCerrado" ADD CONSTRAINT "ReservaLaboratorioCerrado_sedeId_fkey" FOREIGN KEY ("sedeId") REFERENCES "Sede"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservaLaboratorioAbierto" ADD CONSTRAINT "ReservaLaboratorioAbierto_sedeId_fkey" FOREIGN KEY ("sedeId") REFERENCES "Sede"("id") ON DELETE CASCADE ON UPDATE CASCADE;

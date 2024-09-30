/*
  Warnings:

  - Added the required column `laboratorioAbiertoTipo` to the `ReservaLaboratorioAbierto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ReservaLaboratorioAbierto" ADD COLUMN     "laboratorioAbiertoTipo" "LaboratorioAbiertoTipo" NOT NULL;

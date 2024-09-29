/*
  Warnings:

  - Added the required column `concurrentes` to the `ReservaLaboratorioAbierto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ReservaLaboratorioAbierto" ADD COLUMN     "concurrentes" INTEGER NOT NULL;

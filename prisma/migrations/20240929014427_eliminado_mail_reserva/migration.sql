/*
  Warnings:

  - You are about to drop the column `mailConfirmado` on the `ReservaLaboratorioAbierto` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "ReservaLaboratorioAbierto_mailConfirmado_idx";

-- AlterTable
ALTER TABLE "ReservaLaboratorioAbierto" DROP COLUMN "mailConfirmado";

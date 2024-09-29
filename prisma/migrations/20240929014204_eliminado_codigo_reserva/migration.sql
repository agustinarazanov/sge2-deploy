/*
  Warnings:

  - You are about to drop the column `numeroReserva` on the `ReservaEquipo` table. All the data in the column will be lost.
  - You are about to drop the column `numeroReserva` on the `ReservaLaboratorioAbierto` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "ReservaLaboratorioAbierto_numeroReserva_idx";

-- AlterTable
ALTER TABLE "ReservaEquipo" DROP COLUMN "numeroReserva";

-- AlterTable
ALTER TABLE "ReservaLaboratorioAbierto" DROP COLUMN "numeroReserva";

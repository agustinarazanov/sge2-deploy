/*
  Warnings:

  - You are about to drop the column `codigo` on the `Reserva` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Reserva_codigo_key";

-- AlterTable
ALTER TABLE "Reserva" DROP COLUMN "codigo";

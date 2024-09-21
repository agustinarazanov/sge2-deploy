/*
  Warnings:

  - You are about to drop the column `esAbierto` on the `Laboratorio` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Laboratorio_esAbierto_idx";

-- AlterTable
ALTER TABLE "Laboratorio" DROP COLUMN "esAbierto",
ADD COLUMN     "esReservable" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Laboratorio_esReservable_idx" ON "Laboratorio" USING HASH ("esReservable");

/*
  Warnings:

  - You are about to drop the column `estanteId` on the `Estante` table. All the data in the column will be lost.
  - Added the required column `armarioId` to the `Estante` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Estante" DROP CONSTRAINT "Estante_estanteId_fkey";

-- AlterTable
ALTER TABLE "Estante" DROP COLUMN "estanteId",
ADD COLUMN     "armarioId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Estante" ADD CONSTRAINT "Estante_armarioId_fkey" FOREIGN KEY ("armarioId") REFERENCES "Armario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

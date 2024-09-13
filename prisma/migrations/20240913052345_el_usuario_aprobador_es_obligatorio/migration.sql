/*
  Warnings:

  - Made the column `usuarioAprobadorId` on table `Reserva` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Reserva" DROP CONSTRAINT "Reserva_usuarioAprobadorId_fkey";

-- AlterTable
ALTER TABLE "Reserva" ALTER COLUMN "usuarioAprobadorId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_usuarioAprobadorId_fkey" FOREIGN KEY ("usuarioAprobadorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

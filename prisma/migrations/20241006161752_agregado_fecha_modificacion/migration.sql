/*
  Warnings:

  - Added the required column `usuarioModificadorId` to the `Division` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Division" ADD COLUMN     "fechaModificacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "usuarioModificadorId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Mails" (
    "id" INTEGER NOT NULL,
    "emisor" TEXT NOT NULL,
    "para" TEXT NOT NULL,
    "cc" TEXT NOT NULL,
    "cco" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "fechaEnvio" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Mails_id_key" ON "Mails"("id");

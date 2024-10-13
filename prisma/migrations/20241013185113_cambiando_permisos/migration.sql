/*
  Warnings:

  - A unique constraint covering the columns `[nombre,grupo]` on the table `Permiso` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `grupo` to the `Permiso` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Permiso_nombre_key";

-- AlterTable
ALTER TABLE "Permiso" ADD COLUMN     "enDesuso" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "grupo" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Permiso_nombre_grupo_key" ON "Permiso"("nombre", "grupo");

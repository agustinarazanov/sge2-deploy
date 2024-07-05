/*
  Warnings:

  - A unique constraint covering the columns `[inventario]` on the table `Biblioteca` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Biblioteca_inventario_key" ON "Biblioteca"("inventario");

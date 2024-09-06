/*
  Warnings:

  - The primary key for the `MateriaCorrelativa` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Provincia` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Equipo" DROP CONSTRAINT "Equipo_armarioId_fkey";

-- DropForeignKey
ALTER TABLE "Equipo" DROP CONSTRAINT "Equipo_estanteId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_provinciaIso_fkey";

-- DropIndex
DROP INDEX "Libro_bibliotecaId_key";

-- DropIndex
DROP INDEX "Libro_isbn_key";

-- AlterTable
ALTER TABLE "Equipo" ALTER COLUMN "inventarioId" SET DATA TYPE TEXT,
ALTER COLUMN "armarioId" DROP NOT NULL,
ALTER COLUMN "estanteId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Libro" ALTER COLUMN "bibliotecaId" DROP NOT NULL,
ALTER COLUMN "isbn" DROP NOT NULL;

-- AlterTable
ALTER TABLE "MateriaCorrelativa" DROP CONSTRAINT "MateriaCorrelativa_pkey",
ADD CONSTRAINT "MateriaCorrelativa_pkey" PRIMARY KEY ("estatusCorrelativa", "materiaPrerequisitoId", "correlativaId");

-- AlterTable
ALTER TABLE "Provincia" DROP CONSTRAINT "Provincia_pkey",
ADD CONSTRAINT "Provincia_pkey" PRIMARY KEY ("iso", "paisIso");

-- AddForeignKey
ALTER TABLE "Equipo" ADD CONSTRAINT "Equipo_armarioId_fkey" FOREIGN KEY ("armarioId") REFERENCES "Armario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equipo" ADD CONSTRAINT "Equipo_estanteId_fkey" FOREIGN KEY ("estanteId") REFERENCES "Estante"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_provinciaIso_paisIso_fkey" FOREIGN KEY ("provinciaIso", "paisIso") REFERENCES "Provincia"("iso", "paisIso") ON DELETE SET NULL ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE "Libro" DROP CONSTRAINT "Libro_armarioId_fkey";

-- DropForeignKey
ALTER TABLE "Libro" DROP CONSTRAINT "Libro_estanteId_fkey";

-- AlterTable
ALTER TABLE "Libro" ALTER COLUMN "armarioId" DROP NOT NULL,
ALTER COLUMN "estanteId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Libro" ADD CONSTRAINT "Libro_armarioId_fkey" FOREIGN KEY ("armarioId") REFERENCES "Armario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Libro" ADD CONSTRAINT "Libro_estanteId_fkey" FOREIGN KEY ("estanteId") REFERENCES "Estante"("id") ON DELETE SET NULL ON UPDATE CASCADE;

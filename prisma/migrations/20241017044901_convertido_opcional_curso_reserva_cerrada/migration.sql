-- DropForeignKey
ALTER TABLE "MateriaCorrelativa" DROP CONSTRAINT "MateriaCorrelativa_correlativaId_fkey";

-- DropForeignKey
ALTER TABLE "MateriaCorrelativa" DROP CONSTRAINT "MateriaCorrelativa_materiaPrerequisitoId_fkey";

-- AlterTable
ALTER TABLE "ReservaLaboratorioCerrado" ALTER COLUMN "cursoId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "MateriaCorrelativa" ADD CONSTRAINT "MateriaCorrelativa_materiaPrerequisitoId_fkey" FOREIGN KEY ("materiaPrerequisitoId") REFERENCES "Materia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MateriaCorrelativa" ADD CONSTRAINT "MateriaCorrelativa_correlativaId_fkey" FOREIGN KEY ("correlativaId") REFERENCES "Materia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

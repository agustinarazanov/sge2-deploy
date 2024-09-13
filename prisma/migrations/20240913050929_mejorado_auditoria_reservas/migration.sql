/*
  Warnings:

  - Added the required column `usuarioSolicitoId` to the `Reserva` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LibroMateria" DROP CONSTRAINT "LibroMateria_libroId_fkey";

-- DropForeignKey
ALTER TABLE "LibroMateria" DROP CONSTRAINT "LibroMateria_materiaId_fkey";

-- AlterTable
ALTER TABLE "Reserva" ADD COLUMN     "fechaRechazo" TIMESTAMP(3),
ADD COLUMN     "fechaRenovacion" TIMESTAMP(3),
ADD COLUMN     "usuarioAprobadorId" TEXT,
ADD COLUMN     "usuarioRechazadoId" TEXT,
ADD COLUMN     "usuarioRenovoId" TEXT,
ADD COLUMN     "usuarioSolicitoId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "LibroMateria" ADD CONSTRAINT "LibroMateria_libroId_fkey" FOREIGN KEY ("libroId") REFERENCES "Libro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LibroMateria" ADD CONSTRAINT "LibroMateria_materiaId_fkey" FOREIGN KEY ("materiaId") REFERENCES "Materia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_usuarioAprobadorId_fkey" FOREIGN KEY ("usuarioAprobadorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_usuarioRechazadoId_fkey" FOREIGN KEY ("usuarioRechazadoId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

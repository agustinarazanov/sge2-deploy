/*
  Warnings:

  - You are about to drop the column `turnoId` on the `Curso` table. All the data in the column will be lost.
  - You are about to drop the `CursoTurno` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `turno` to the `Curso` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TurnoCurso" AS ENUM ('MANANA', 'TARDE', 'NOCHE');

-- DropForeignKey
ALTER TABLE "Curso" DROP CONSTRAINT "Curso_turnoId_fkey";

-- DropForeignKey
ALTER TABLE "Materia" DROP CONSTRAINT "Materia_directorUsuarioId_fkey";

-- DropForeignKey
ALTER TABLE "Materia" DROP CONSTRAINT "Materia_jefeTrabajoPracticoUsuarioId_fkey";

-- AlterTable
ALTER TABLE "Curso" DROP COLUMN "turnoId",
ADD COLUMN     "turno" "TurnoCurso" NOT NULL;

-- AlterTable
ALTER TABLE "Materia" ALTER COLUMN "directorUsuarioId" DROP NOT NULL,
ALTER COLUMN "jefeTrabajoPracticoUsuarioId" DROP NOT NULL;

-- DropTable
DROP TABLE "CursoTurno";

-- CreateIndex
CREATE INDEX "Curso_turno_idx" ON "Curso" USING HASH ("turno");

-- AddForeignKey
ALTER TABLE "Materia" ADD CONSTRAINT "Materia_directorUsuarioId_fkey" FOREIGN KEY ("directorUsuarioId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Materia" ADD CONSTRAINT "Materia_jefeTrabajoPracticoUsuarioId_fkey" FOREIGN KEY ("jefeTrabajoPracticoUsuarioId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

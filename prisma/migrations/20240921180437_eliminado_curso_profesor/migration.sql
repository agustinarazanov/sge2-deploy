/*
  Warnings:

  - You are about to drop the `CursoProfesor` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `profesorId` to the `Curso` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CursoProfesor" DROP CONSTRAINT "CursoProfesor_cursoId_fkey";

-- DropForeignKey
ALTER TABLE "CursoProfesor" DROP CONSTRAINT "CursoProfesor_userId_fkey";

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "refresh_expires_in" INTEGER;

-- AlterTable
ALTER TABLE "Curso" ADD COLUMN     "profesorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "esTutor" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "image" SET DEFAULT '/default-avatar.svg';

-- DropTable
DROP TABLE "CursoProfesor";

-- AddForeignKey
ALTER TABLE "Curso" ADD CONSTRAINT "Curso_profesorId_fkey" FOREIGN KEY ("profesorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

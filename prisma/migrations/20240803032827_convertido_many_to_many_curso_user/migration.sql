/*
  Warnings:

  - You are about to drop the column `ayudanteUserId` on the `Curso` table. All the data in the column will be lost.
  - You are about to drop the column `profesorUserId` on the `Curso` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Curso" DROP CONSTRAINT "Curso_ayudanteUserId_fkey";

-- DropForeignKey
ALTER TABLE "Curso" DROP CONSTRAINT "Curso_profesorUserId_fkey";


-- CreateTable
CREATE TABLE "CursoAyudante" (
    "cursoId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "CursoAyudante_pkey" PRIMARY KEY ("cursoId","userId")
);

-- CreateTable
CREATE TABLE "CursoProfesor" (
    "cursoId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "CursoProfesor_pkey" PRIMARY KEY ("cursoId","userId")
);

INSERT INTO "CursoAyudante" ("cursoId", "userId") SELECT "id", "ayudanteUserId" FROM "Curso";
INSERT INTO "CursoProfesor" ("cursoId", "userId") SELECT "id", "profesorUserId" FROM "Curso";

-- AlterTable
ALTER TABLE "Curso" DROP COLUMN "ayudanteUserId",
DROP COLUMN "profesorUserId",
ALTER COLUMN "horaInicio2" DROP NOT NULL,
ALTER COLUMN "duracion2" DROP NOT NULL,
ALTER COLUMN "dia2" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "nombre" TEXT;

-- AddForeignKey
ALTER TABLE "CursoAyudante" ADD CONSTRAINT "CursoAyudante_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CursoAyudante" ADD CONSTRAINT "CursoAyudante_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CursoProfesor" ADD CONSTRAINT "CursoProfesor_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CursoProfesor" ADD CONSTRAINT "CursoProfesor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

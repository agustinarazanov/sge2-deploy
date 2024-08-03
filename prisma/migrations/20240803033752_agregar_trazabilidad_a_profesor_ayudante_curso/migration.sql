/*
  Warnings:

  - Added the required column `usuarioCreadorId` to the `CursoAyudante` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuarioModificadorId` to the `CursoAyudante` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuarioCreadorId` to the `CursoProfesor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuarioModificadorId` to the `CursoProfesor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CursoAyudante" ADD COLUMN     "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fechaModificacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "usuarioCreadorId" TEXT NOT NULL,
ADD COLUMN     "usuarioModificadorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CursoProfesor" ADD COLUMN     "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fechaModificacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "usuarioCreadorId" TEXT NOT NULL,
ADD COLUMN     "usuarioModificadorId" TEXT NOT NULL;

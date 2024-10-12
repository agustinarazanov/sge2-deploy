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

-- CreateTable
CREATE TABLE "UsuarioPermiso" (
    "userId" TEXT NOT NULL,
    "permisoId" INTEGER NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioCreadorId" TEXT NOT NULL,

    CONSTRAINT "UsuarioPermiso_pkey" PRIMARY KEY ("userId","permisoId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Permiso_nombre_grupo_key" ON "Permiso"("nombre", "grupo");

-- AddForeignKey
ALTER TABLE "UsuarioPermiso" ADD CONSTRAINT "UsuarioPermiso_permisoId_fkey" FOREIGN KEY ("permisoId") REFERENCES "Permiso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioPermiso" ADD CONSTRAINT "UsuarioPermiso_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

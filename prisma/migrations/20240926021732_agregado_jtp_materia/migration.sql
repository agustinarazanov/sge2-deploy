/*
  Warnings:

  - You are about to drop the column `jefeTrabajoPracticoUsuarioId` on the `Materia` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Materia" DROP CONSTRAINT "Materia_jefeTrabajoPracticoUsuarioId_fkey";

-- AlterTable
ALTER TABLE "Materia" DROP COLUMN "jefeTrabajoPracticoUsuarioId";

-- CreateTable
CREATE TABLE "MateriaJefeTp" (
    "materiaId" INTEGER NOT NULL,
    "jefeTrabajoPracticoUsuarioId" TEXT NOT NULL,

    CONSTRAINT "MateriaJefeTp_pkey" PRIMARY KEY ("materiaId","jefeTrabajoPracticoUsuarioId")
);

-- AddForeignKey
ALTER TABLE "MateriaJefeTp" ADD CONSTRAINT "MateriaJefeTp_materiaId_fkey" FOREIGN KEY ("materiaId") REFERENCES "Materia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MateriaJefeTp" ADD CONSTRAINT "MateriaJefeTp_jefeTrabajoPracticoUsuarioId_fkey" FOREIGN KEY ("jefeTrabajoPracticoUsuarioId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

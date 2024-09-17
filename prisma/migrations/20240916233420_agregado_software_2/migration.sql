/*
  Warnings:

  - You are about to drop the `_LaboratorioToSoftware` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_LaboratorioToSoftware" DROP CONSTRAINT "_LaboratorioToSoftware_A_fkey";

-- DropForeignKey
ALTER TABLE "_LaboratorioToSoftware" DROP CONSTRAINT "_LaboratorioToSoftware_B_fkey";

-- DropTable
DROP TABLE "_LaboratorioToSoftware";

-- CreateTable
CREATE TABLE "SoftwareLaboratorio" (
    "softwareId" INTEGER NOT NULL,
    "laboratorioId" INTEGER NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioCreadorId" TEXT NOT NULL,

    CONSTRAINT "SoftwareLaboratorio_pkey" PRIMARY KEY ("softwareId","laboratorioId")
);

-- AddForeignKey
ALTER TABLE "SoftwareLaboratorio" ADD CONSTRAINT "SoftwareLaboratorio_softwareId_fkey" FOREIGN KEY ("softwareId") REFERENCES "Software"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoftwareLaboratorio" ADD CONSTRAINT "SoftwareLaboratorio_laboratorioId_fkey" FOREIGN KEY ("laboratorioId") REFERENCES "Laboratorio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

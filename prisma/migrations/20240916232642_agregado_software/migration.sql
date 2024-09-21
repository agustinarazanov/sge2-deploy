-- CreateTable
CREATE TABLE "Software" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaModificacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioCreadorId" TEXT NOT NULL,
    "usuarioModificadorId" TEXT NOT NULL,

    CONSTRAINT "Software_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LaboratorioToSoftware" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LaboratorioToSoftware_AB_unique" ON "_LaboratorioToSoftware"("A", "B");

-- CreateIndex
CREATE INDEX "_LaboratorioToSoftware_B_index" ON "_LaboratorioToSoftware"("B");

-- AddForeignKey
ALTER TABLE "_LaboratorioToSoftware" ADD CONSTRAINT "_LaboratorioToSoftware_A_fkey" FOREIGN KEY ("A") REFERENCES "Laboratorio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LaboratorioToSoftware" ADD CONSTRAINT "_LaboratorioToSoftware_B_fkey" FOREIGN KEY ("B") REFERENCES "Software"("id") ON DELETE CASCADE ON UPDATE CASCADE;

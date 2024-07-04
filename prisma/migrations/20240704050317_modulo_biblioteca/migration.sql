-- CreateTable
CREATE TABLE "Biblioteca" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "inventario" TEXT NOT NULL,
    "bibliotecaId" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "anio" TEXT NOT NULL,
    "editorial" TEXT NOT NULL,
    "idioma" TEXT NOT NULL,
    "isbn" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "Biblioteca_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Biblioteca_titulo_idx" ON "Biblioteca"("titulo");

-- AddForeignKey
ALTER TABLE "Biblioteca" ADD CONSTRAINT "Biblioteca_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

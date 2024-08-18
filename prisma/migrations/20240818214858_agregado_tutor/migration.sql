-- DropForeignKey
ALTER TABLE "RolPermiso" DROP CONSTRAINT "RolPermiso_permisoId_fkey";

-- DropForeignKey
ALTER TABLE "RolPermiso" DROP CONSTRAINT "RolPermiso_rolId_fkey";

-- AlterTable
ALTER TABLE "Equipo" ALTER COLUMN "modelo" DROP NOT NULL,
ALTER COLUMN "numeroSerie" DROP NOT NULL,
ALTER COLUMN "observaciones" DROP NOT NULL,
ALTER COLUMN "palabrasClave" DROP NOT NULL,
ALTER COLUMN "imagen" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "esDocente" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Tutor" (
    "userId" TEXT NOT NULL,
    "diasHorarios" TEXT NOT NULL,
    "sede" TEXT NOT NULL,
    "especialidad" TEXT NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioCreadorId" TEXT NOT NULL,

    CONSTRAINT "Tutor_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tutor_userId_key" ON "Tutor"("userId");

-- AddForeignKey
ALTER TABLE "Tutor" ADD CONSTRAINT "Tutor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolPermiso" ADD CONSTRAINT "RolPermiso_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "Rol"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolPermiso" ADD CONSTRAINT "RolPermiso_permisoId_fkey" FOREIGN KEY ("permisoId") REFERENCES "Permiso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

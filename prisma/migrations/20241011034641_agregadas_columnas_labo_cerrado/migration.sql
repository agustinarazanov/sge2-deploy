-- AlterTable
ALTER TABLE "ReservaLaboratorioAbierto" ALTER COLUMN "descripcion" SET DEFAULT '';

-- AlterTable
ALTER TABLE "ReservaLaboratorioCerrado" ADD COLUMN     "descripcion" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "requierePC" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requiereProyector" BOOLEAN NOT NULL DEFAULT false;

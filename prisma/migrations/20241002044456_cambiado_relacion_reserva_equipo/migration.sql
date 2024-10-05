-- DropForeignKey
ALTER TABLE "ReservaLaboratorioAbiertoEquipo" DROP CONSTRAINT "ReservaLaboratorioAbiertoEquipo_equipoId_fkey";

-- DropForeignKey
ALTER TABLE "ReservaLaboratorioCerradoEquipo" DROP CONSTRAINT "ReservaLaboratorioCerradoEquipo_equipoId_fkey";

-- AddForeignKey
ALTER TABLE "ReservaLaboratorioCerradoEquipo" ADD CONSTRAINT "ReservaLaboratorioCerradoEquipo_equipoId_fkey" FOREIGN KEY ("equipoId") REFERENCES "EquipoTipo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservaLaboratorioAbiertoEquipo" ADD CONSTRAINT "ReservaLaboratorioAbiertoEquipo_equipoId_fkey" FOREIGN KEY ("equipoId") REFERENCES "EquipoTipo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

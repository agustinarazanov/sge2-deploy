-- DropForeignKey
ALTER TABLE "ReservaLaboratorioCerradoEquipo" DROP CONSTRAINT "ReservaLaboratorioCerradoEquipo_reservaLaboratorioCerradoI_fkey";

-- AddForeignKey
ALTER TABLE "ReservaLaboratorioCerradoEquipo" ADD CONSTRAINT "ReservaLaboratorioCerradoEquipo_reservaLaboratorioCerradoI_fkey" FOREIGN KEY ("reservaLaboratorioCerradoId") REFERENCES "ReservaLaboratorioCerrado"("id") ON DELETE CASCADE ON UPDATE CASCADE;

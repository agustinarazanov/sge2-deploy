import { api } from "@/trpc/server";
import { CursosTable } from "./table";
import { inputGetCursosParaReserva } from "@/shared/filters/cursos-filter.schema";

export default async function LaboratorioReservaTableContainer({
  filterByUserId,
  filterByCatedraId,
}: {
  filterByUserId: boolean;
  filterByCatedraId: boolean;
}) {
  const filters = inputGetCursosParaReserva.parse({});

  const data = await api.cursos.getAll({
    ...filters,
    filtrByUserId: filterByUserId ? "true" : "false",
    filtrByCatedraId: filterByCatedraId ? "true" : "false",
  });

  return <CursosTable data={data} />;
}

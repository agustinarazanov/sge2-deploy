import { api } from "@/trpc/server";
import { CursosTable } from "./table";
import { inputGetCursosParaReserva } from "@/shared/filters/cursos-filter.schema";

export default async function LaboratorioReservaTableContainer() {
  const filters = inputGetCursosParaReserva.parse({});

  const data = await api.cursos.getAll(filters);

  return <CursosTable data={data} />;
}

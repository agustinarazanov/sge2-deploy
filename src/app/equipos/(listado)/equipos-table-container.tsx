import { api } from "@/trpc/server";
import { EquiposTable } from "./table";
import { type z } from "zod";
import { type inputGetEquipos } from "@/shared/equipos-filter.schema";

type EquiposFilters = z.infer<typeof inputGetEquipos>;

type EquiposTableContainerProps = {
  filters: EquiposFilters;
};

export default async function EquiposTableContainer({ filters }: EquiposTableContainerProps) {
  const data = await api.equipos.getAll(filters);

  return <EquiposTable data={data} filters={filters} />;
}

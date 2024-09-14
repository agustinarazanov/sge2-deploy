import { api } from "@/trpc/server";
import { type z } from "zod";
import { TiposTable } from "./tipos-table";
import { type inputGetTipos } from "@/shared/filters/equipos-tipos-filter.schema";

type TiposFilters = z.infer<typeof inputGetTipos>;

type Props = {
  filters: TiposFilters;
};

export default async function TiposTableContainer({ filters }: Props) {
  const tipos = await api.equipos.getAllTipos(filters);

  return <TiposTable data={tipos} filters={filters} />;
}

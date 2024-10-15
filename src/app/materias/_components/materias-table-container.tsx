import { api } from "@/trpc/server";
import { MateriasTable } from "./table";

type MateriasTableContainerProps = {
  filters: any;
};

export default async function MateriasTableContainer({ filters }: MateriasTableContainerProps) {
  const data = await api.materia.getAll(filters);
  return <MateriasTable data={data} />;
}

import { api } from "@/trpc/server";
import { MateriasTable } from "./table";

export default async function MateriasTableContainer() {
  const data = await api.materia.getAll();
  return <MateriasTable data={data} />;
}

import { api } from "@/trpc/server";
import { DivisionesTable } from "./table";

export default async function DivisionesTableContainer() {
  const data = await api.division.getAll();
  return <DivisionesTable data={data} />;
}

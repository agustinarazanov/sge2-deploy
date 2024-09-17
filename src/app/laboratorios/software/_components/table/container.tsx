import { api } from "@/trpc/server";
import { SoftwareTable } from "./software-table";

export default async function SoftwareTableContainer() {
  const softwares = await api.software.getAll();

  return <SoftwareTable data={softwares} />;
}

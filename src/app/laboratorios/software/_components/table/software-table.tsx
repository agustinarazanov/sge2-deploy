"use client";

import { DataTable } from "@/components/ui";
import { type RouterOutputs } from "@/trpc/react";
import { getColumns } from "./columns";
import { SoftwareNuevoEditar } from "../actions/software-nuevo";
import EliminarSoftwareModal from "../actions/software-eliminar";
import { useRouter } from "next/navigation";

type SoftwareData = RouterOutputs["software"]["getAll"];

type BibliotecaTableProps = {
  data: SoftwareData;
};

export const SoftwareTable = ({ data }: BibliotecaTableProps) => {
  const router = useRouter();

  const columns = getColumns();

  // TODO: Implement resizing
  return (
    <>
      En construcción 👷🏻👷🏻‍♂️👷🏻‍♂️👷🏻‍♂️👷🏻‍♂️ - Filtros
      <DataTable
        data={data ?? []}
        columns={columns}
        action={{
          header: "Acciones",
          cell({ original }) {
            return (
              <>
                <SoftwareNuevoEditar softwareId={original.id} />
                <EliminarSoftwareModal
                  softwareId={original.id}
                  nombre={original.nombre}
                  onSubmit={() => router.refresh()}
                />
              </>
            );
          },
        }}
      />
    </>
  );
};

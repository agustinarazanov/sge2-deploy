"use client";

import { DataTable } from "@/components/ui";
import { type RouterOutputs } from "@/trpc/react";
import { ReservarLaboratorioCerradoModal } from "./editar-curso";
import { getColumns } from "./columns";

type CursoData = RouterOutputs["cursos"]["getAll"];

type CursosTableProps = {
  data: CursoData;
};

export const CursosTable = ({ data }: CursosTableProps) => {
  const columns = getColumns();

  // TODO: Implement resizing
  return (
    <>
      <DataTable
        data={data.cursos ?? []}
        columns={columns}
        action={{
          header: "Acciones",
          cell({ original }) {
            return (
              <>
                <ReservarLaboratorioCerradoModal cursoId={original.id} />
              </>
            );
          },
        }}
      />
    </>
  );
};

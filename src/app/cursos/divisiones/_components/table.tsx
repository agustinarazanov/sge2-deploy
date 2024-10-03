"use client";

import { DataTable } from "@/components/ui"; // Asegúrate de que esto sea correcto
import { type RouterOutputs } from "@/trpc/react"; // Asegúrate de que esto sea correcto
import { type z } from "zod";
import { DataTablePaginationStandalone } from "@/components/ui/table/table-pagination-standalone";
import { getColumns } from "./columns"; // Asegúrate de definir las columnas para divisiones
import { type SortingState } from "@tanstack/react-table";
import RemoveDivisionModal from "./remove-division";
import EditDivisionModal from "./edit-division";
import { useRouter } from "next/navigation";
import React from "react";

type DivisionData = RouterOutputs["division"]["getAll"];

type DivisionesTableProps = {
  data: DivisionData;
};

export const DivisionesTable = ({ data }: DivisionesTableProps) => {
  const columns = getColumns();
  const router = useRouter();
  const onDeleteDivision = () => {
    router.refresh();
  };
  return (
    <>
      <DataTable
        data={data ?? []}
        columns={columns}
        action={{
          header: "Acciones",
          cell({ original }) {
            return (
              <>
                <EditDivisionModal divisionId={original.id.toString()} />
                <RemoveDivisionModal divisionId={original.id} nombre={original.nombre} onSubmit={onDeleteDivision} />
              </>
            );
          },
        }}
      />
    </>
  );
};

export default DivisionesTable; // Exporta el componente

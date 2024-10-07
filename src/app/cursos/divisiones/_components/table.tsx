"use client";

import { DataTable } from "@/components/ui";
import { type RouterOutputs } from "@/trpc/react";
import { getColumns } from "./columns";
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

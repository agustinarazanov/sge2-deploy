"use client";

import { DataTable } from "@/components/ui";
import { type RouterOutputs } from "@/trpc/react";
import { getColumns } from "./columns";
import EliminarReservaPantallaModal from "../actions/pantalla-eliminar";
import { useRouter } from "next/navigation";
import React, { useState, type HTMLProps } from "react";
import { type ColumnDef } from "@tanstack/react-table";

type PantallaData = RouterOutputs["reservas"]["pantalla"]["getReservaPorUser"];

type BibliotecaTableProps = {
  data: PantallaData;
};

export const PantallaTable = ({ data }: BibliotecaTableProps) => {
  const router = useRouter();

  const [rowSelection, setRowSelection] = useState<Record<number, boolean>>({});
  const cursosAEliminar = Object.keys(rowSelection).map((n) => Number(n));

  const columnsBase = getColumns();

  const columns = React.useMemo<ColumnDef<PantallaData[number]>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <div className="px-1">
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
        meta: {
          header: {
            hideSort: true,
          },
        },
      },
      ...columnsBase,
    ],
    [columnsBase],
  );

  // TODO: Implement resizing
  return (
    <>
      <DataTable
        data={data ?? []}
        columns={columns}
        config={{
          onRowSelectionChange: setRowSelection,
          rowSelection,
        }}
        action={{
          header: "Acciones",
          cell({ original }) {
            return (
              <>
                <EliminarReservaPantallaModal
                  ids={cursosAEliminar.length ? cursosAEliminar : [original.id]}
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

const IndeterminateCheckbox = ({
  indeterminate,
  className = "",
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) => {
  const ref = React.useRef<HTMLInputElement>(null!);

  React.useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate, rest.checked]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={
        className +
        " peer h-4 w-4 shrink-0 cursor-pointer rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
      }
      {...rest}
    />
  );
};

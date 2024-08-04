"use client";

import React, { useMemo, useState } from "react";
import { Autocomplete, Select, SelectTrigger, SelectValue } from "@/components/ui";
import { api } from "@/trpc/react";
import { Skeleton } from "@/components/ui/skeleton";
import { type z } from "zod";
import { useAdminRolesQueryParam } from "../../_hooks/use-admin-roles-query-param";
import { estaDentroDe } from "@/shared/string-compare";
import { type inputGetRoles } from "@/shared/filters/admin-roles-filter.schema";

type AdminRolesFilters = z.infer<typeof inputGetRoles>;

type Props = {
  filters: AdminRolesFilters;
};

export const AdminRolesFilterPermiso = ({ filters }: Props) => {
  const { permiso, onPermisoChange } = useAdminRolesQueryParam(filters);

  const [query, setQuery] = useState("");

  const { data, isLoading, isError } = api.admin.roles.getAllPermisos.useQuery();

  const permisos = useMemo(() => {
    if (!data) return [];

    return data
      .map((item) => {
        const { id, nombre } = item;
        return {
          id: id,
          label: `${nombre} `,
          data: item,
        };
      })
      .filter((item) => !query || estaDentroDe(query, item.label));
  }, [data, query]);

  const currentPermiso = useMemo(() => {
    if (!permisos) return null;

    return permisos.find((item) => String(item.id) === permiso);
  }, [permisos, permiso]);

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex flex-row items-center space-x-2">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full">
        <Select>
          <div className="flex flex-row items-center space-x-2">
            <SelectTrigger
              disabled
              id="selectPermiso"
              className="h-10 transition-colors focus:border-primary focus:ring-0 group-hover:border-input-hover"
            >
              <SelectValue placeholder="Error cargando permisos" />
            </SelectTrigger>
          </div>
        </Select>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Autocomplete
        async
        items={permisos}
        noOptionsComponent={
          <div className="flex flex-col items-center justify-center gap-2 px-4 py-6 text-sm">
            <span>No se encontró la permiso</span>
          </div>
        }
        className={""}
        onQueryChange={setQuery}
        isLoading={isLoading}
        placeholder="Buscar por nombre de permiso"
        clearable
        debounceTime={0}
        value={currentPermiso}
        onChange={(value) => onPermisoChange(value?.id ? String(value.id) : "")}
      />
    </div>
  );
};

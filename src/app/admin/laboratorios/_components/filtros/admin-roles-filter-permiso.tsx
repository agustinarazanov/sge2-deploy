"use client";

import React from "react";
import { type z } from "zod";
import { useAdminLaboratoriosQueryParam } from "../../_hooks/use-admin-laboratorios-query-param";
import { type inputGetRoles } from "@/shared/filters/admin-roles-filter.schema";
import { PermisosSelector } from "./permisos-selector";

type AdminRolesFilters = z.infer<typeof inputGetRoles>;

type Props = {
  filters: AdminRolesFilters;
};

export const AdminRolesFilterPermiso = ({ filters }: Props) => {
  const { permiso, onPermisoChange } = useAdminLaboratoriosQueryParam(filters);

  return (
    <>
      <PermisosSelector onPermisoChange={onPermisoChange} currentPermisoId={Number(permiso)} />
    </>
  );
};

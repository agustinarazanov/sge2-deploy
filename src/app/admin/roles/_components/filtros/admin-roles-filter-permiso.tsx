"use client";

import React from "react";
import { type z } from "zod";
import { useAdminRolesQueryParam } from "../../_hooks/use-admin-roles-query-param";
import { type inputGetRoles } from "@/shared/filters/admin-roles-filter.schema";
import { PermisosSelector } from "./permisos-selector";

type AdminRolesFilters = z.infer<typeof inputGetRoles>;

type Props = {
  filters: AdminRolesFilters;
};

export const AdminRolesFilterPermiso = ({ filters }: Props) => {
  const { permiso, onPermisoChange } = useAdminRolesQueryParam(filters);

  return (
    <>
      <PermisosSelector onPermisoChange={onPermisoChange} currentPermisoId={Number(permiso)} />
    </>
  );
};

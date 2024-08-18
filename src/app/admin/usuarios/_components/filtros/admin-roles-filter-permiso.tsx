"use client";

import React from "react";
import { type z } from "zod";
import { useAdminUsuariosQueryParam } from "../../_hooks/use-admin-usuarios-query-param";
import { type inputGetRoles } from "@/shared/filters/admin-roles-filter.schema";
import { RolesSelector } from "./roles-selector";

type AdminUsuariosFilters = z.infer<typeof inputGetRoles>;

type Props = {
  filters: AdminUsuariosFilters;
};

export const AdminUsuariosFilterRol = ({ filters }: Props) => {
  const { rol, onRolChange } = useAdminUsuariosQueryParam(filters);

  return (
    <>
      <RolesSelector onRolChange={onRolChange} currentRolId={Number(rol)} />
    </>
  );
};

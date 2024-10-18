"use client";

import { api } from "@/trpc/react";

export const useTienePermisos = (permisos: string[] = []) => {
  // Validamos que permisos sea siempre un array
  if (!Array.isArray(permisos)) {
    permisos = [];
  }

  // Si el array de permisos está vacío, retornamos true de inmediato
  if (permisos.length === 0) {
    return {
      tienePermisos: true,
      isLoading: false,
      error: null,
    };
  }

  const {
    data: tienePermisosResponse,
    isLoading,
    error,
  } = api.permisos.usuarioTienePermisos.useQuery(
    {
      permisos,
    },
    {
      refetchOnWindowFocus: false,
    },
  );

  return {
    tienePermisos: tienePermisosResponse ?? false,
    isLoading,
    error,
  };
};

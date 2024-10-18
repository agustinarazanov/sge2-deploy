"use client";

import { useTienePermisos } from "@/app/_hooks/use-tiene-permisos";

type TienePermisoProps = {
  permisos: string[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
};

export const TienePermiso = ({ permisos, fallback = null, children }: TienePermisoProps) => {
  const { tienePermisos, isLoading, error } = useTienePermisos(permisos);

  if (isLoading) {
    return null;
  }

  if (error) {
    return null;
  }

  return tienePermisos ? <>{children}</> : <>{fallback}</>;
};

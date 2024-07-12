type AppRoute = {
  href: string;
  label: string;
  isPublic?: boolean;
  inConstruction?: boolean;
};

export const INICIO_ROUTE: AppRoute = {
  href: "/",
  label: "Inicio",
  isPublic: true,
};

export const BIBLIOTECA_ROUTE: AppRoute = {
  href: "/biblioteca",
  label: "Biblioteca",
  isPublic: false,
};

const LABORATORIO_ROUTE: AppRoute = {
  href: "/laboratorio",
  label: "Laboratorio",
  isPublic: false,
  inConstruction: true,
};

const LABORATORIO_ABIERTO_ROUTE: AppRoute = {
  href: "/laboratorio-abierto",
  label: "Laboratorio Abierto",
  isPublic: false,
  inConstruction: true,
};

const EQUIPOS_ROUTE: AppRoute = {
  href: "/equipos",
  label: "Equipos",
  isPublic: false,
  inConstruction: true,
};

export const APP_ROUTES: AppRoute[] = [
  INICIO_ROUTE,
  BIBLIOTECA_ROUTE,
  LABORATORIO_ROUTE,
  LABORATORIO_ABIERTO_ROUTE,
  EQUIPOS_ROUTE,
];

export const APP_ROUTES_MAP = APP_ROUTES.reduce(
  (acc, route) => {
    acc[route.href] = route;
    return acc;
  },
  {} as Record<string, AppRoute>,
);

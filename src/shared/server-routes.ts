type AppRoute = {
  href: string;
  label: string;
  isPublic?: boolean;
  inConstruction?: boolean;
  subRutas?: AppRoute[];
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
  subRutas: [
    {
      href: "/biblioteca",
      label: "Listado",
      isPublic: false,
    },
    {
      href: "/biblioteca/prestamos",
      label: "Prestamos",
      isPublic: false,
    },
  ],
};

export const LABORATORIO_ROUTE: AppRoute = {
  href: "/laboratorios/mis_cursos",
  label: "Laboratorios",
  isPublic: false,
  subRutas: [
    // {
    //   href: "/laboratorios/mis_cursos",
    //   label: "Mis cursos",
    //   isPublic: false,
    // },
    {
      href: "/laboratorios/catedra",
      label: "Cátedra",
      isPublic: false,
    },
  ],
};

export const LABORATORIO_ABIERTO_ROUTE: AppRoute = {
  href: "/laboratorio_abierto/reservar",
  label: "Laboratorio abierto",
  isPublic: false,
  subRutas: [
    // {
    //   href: "/laboratorio_abierto/reservar",
    //   label: "Reservar",
    //   isPublic: false,
    // },
    {
      href: "/laboratorio_abierto/mis_reservas",
      label: "Mis reservas",
      isPublic: false,
    },
    {
      href: "/laboratorio_abierto/tutores",
      label: "Tutores",
      isPublic: false,
    },
  ],
};

export const EQUIPOS_ROUTE: AppRoute = {
  href: "/equipos",
  label: "Equipos",
  isPublic: false,
  subRutas: [
    {
      href: "/equipos",
      label: "Listado",
      isPublic: false,
    },
    {
      href: "/equipos/prestamos",
      label: "Prestamos",
      isPublic: false,
    },
  ],
};

export const CURSOS_ROUTE: AppRoute = {
  href: "/cursos",
  label: "Cursos",
  isPublic: false,
  subRutas: [
    {
      href: "/cursos",
      label: "Listado",
      isPublic: false,
    },
    {
      href: "/cursos/mis_cursos",
      label: "Mis cursos",
      isPublic: false,
    },
  ],
};

export const ADMIN_ROUTE: AppRoute = {
  href: "/admin/roles",
  label: "Administración",
  isPublic: false,
  subRutas: [
    // {
    //   href: "/admin/roles",
    //   label: "Roles",
    //   isPublic: false,
    // },
    {
      href: "/admin/usuarios",
      label: "Usuarios",
      isPublic: false,
    },
    {
      href: "/admin/laboratorios",
      label: "Laboratorios",
      isPublic: false,
    },
  ],
};

export const APP_ROUTES: AppRoute[] = [
  INICIO_ROUTE,
  BIBLIOTECA_ROUTE,
  CURSOS_ROUTE,
  EQUIPOS_ROUTE,
  LABORATORIO_ROUTE,
  LABORATORIO_ABIERTO_ROUTE,
  ADMIN_ROUTE,
];

export const APP_ROUTES_MAP = APP_ROUTES.reduce(
  (acc, route) => {
    acc[route.href] = route;
    return acc;
  },
  {} as Record<string, AppRoute>,
);

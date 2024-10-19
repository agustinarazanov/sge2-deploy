export type AppRoute = {
  href: string;
  label: string;
  isPublic: boolean;
  inConstruction?: boolean;
  subRutas?: AppRoute[];
};

export const INICIO_ROUTE: AppRoute = {
  href: "/",
  label: "Inicio",
  isPublic: true,
};

export const BIBLIOTECA_ROUTE = {
  href: "/biblioteca",
  label: "Biblioteca",
  isPublic: false,
  subRutas: [
    {
      href: "/biblioteca",
      label: "Biblioteca",
      isPublic: false,
    },
    {
      href: "/biblioteca/prestamos",
      label: "Préstamos",
      isPublic: false,
    },
    {
      href: "/biblioteca/mis_prestamos",
      label: "Mis préstamos",
      isPublic: false,
    },
  ],
};

export const LABORATORIO_ROUTE = {
  href: "/laboratorios",
  label: "Laboratorios",
  isPublic: false,
  subRutas: [
    {
      href: "/laboratorios/mis_cursos",
      label: "Mis cursos",
      isPublic: false,
    },
    {
      href: "/laboratorios/catedra",
      label: "Cátedra",
      isPublic: false,
    },
    {
      href: "/laboratorios/software",
      label: "Aplicaciones",
      isPublic: false,
    },
    {
      href: "/laboratorios/pantalla",
      label: "Reservas",
      isPublic: false,
    },
    {
      href: "/laboratorios/mis_reservas",
      label: "Mis reservas",
      isPublic: false,
    },
    {
      href: "/laboratorios/solicitudes",
      label: "Solicitudes",
      isPublic: false,
    },
  ],
};

export const LABORATORIO_ABIERTO_ROUTE = {
  href: "/laboratorio_abierto",
  label: "Laboratorio abierto",
  isPublic: false,
  subRutas: [
    {
      href: "/laboratorio_abierto/reservar",
      label: "Reservar",
      isPublic: false,
    },
    {
      href: "/laboratorio_abierto/solicitudes",
      label: "Solicitudes",
      isPublic: false,
    },
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
      label: "Equipos",
      isPublic: false,
    },
    {
      href: "/equipos/tipos",
      label: "Tipos",
      isPublic: false,
    },
    {
      href: "/equipos/prestamos",
      label: "Préstamos",
      isPublic: false,
    },
    {
      href: "/equipos/mis_prestamos",
      label: "Mis préstamos",
      isPublic: false,
    },
  ],
};

export const MATERIA_ROUTE = {
  href: "/materias",
  label: "Materias",
  isPublic: false,
  subRutas: [
    {
      href: "/materias",
      label: "Listado",
      isPublic: false,
    },
  ],
};

export const CURSOS_ROUTE = {
  href: "/cursos",
  label: "Cursos",
  isPublic: false,
  subRutas: [
    {
      href: "/cursos",
      label: "Cursos",
      isPublic: false,
    },
    {
      href: "/cursos/mis_cursos",
      label: "Mis cursos",
      isPublic: false,
    },
    {
      href: "/cursos/divisiones",
      label: "Divisiones",
      isPublic: false,
    },
  ],
};

export const ADMIN_ROUTE = {
  href: "/admin",
  label: "Administración",
  isPublic: false,
  subRutas: [
    {
      href: "/admin/roles",
      label: "Roles",
      isPublic: false,
    },
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
  MATERIA_ROUTE,
];

export const USER_ROUTES = (id: string): AppRoute[] => [
  {
    href: "/perfil/" + id,
    label: "Perfil",
    isPublic: false,
  },
  {
    href: "/api/auth/signout",
    label: "Cerrar sesión",
    isPublic: false,
  },
];

export const APP_ROUTES_MAP = APP_ROUTES.reduce(
  (acc, route) => {
    acc[route.href] = route;
    return acc;
  },
  {} as Record<string, AppRoute>,
);

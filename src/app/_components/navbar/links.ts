type NavbarLink = {
  href: string;
  label: string;
  isPublic?: boolean;
  inConstruction?: boolean;
};

export const NAVBAR_LINKS: NavbarLink[] = [
  {
    href: "/",
    label: "Inicio",
    isPublic: true,
  },
  {
    href: "/biblioteca",
    label: "Biblioteca",
    isPublic: false,
  },
  {
    href: "/laboratorio",
    label: "Laboratorio",
    isPublic: false,
    inConstruction: true,
  },
  {
    href: "/laboratorio-abierto",
    label: "Laboratorio Abierto",
    isPublic: false,
    inConstruction: true,
  },
  {
    href: "/equipos",
    label: "Equipos",
    isPublic: false,
    inConstruction: true,
  },
];

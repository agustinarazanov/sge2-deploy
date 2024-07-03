type NavbarLink = {
    href: string;
    label: string;
    isPublic?: boolean;
}

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
];

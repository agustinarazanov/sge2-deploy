"use client";

import { type Session } from "next-auth";
import { NavbarLink } from "./navbarLink";
import { NAVBAR_LINKS } from "./links";
import { usePathname } from "next/navigation";

import cn from "classnames";

type MobileViewProps = {
  user: Session["user"] | undefined;
  isMobile?: boolean;
};

const MOBILE_CLASS = "space-y-1 px-2 py-2";
const DESKTOP_CLASS = "flex space-x-4";

export default function NavbarViewLinks({ user, isMobile }: MobileViewProps) {
  const isLogged = user !== undefined;

  const pathname = usePathname();

  const availableLinks = NAVBAR_LINKS.filter(
    (link) => isLogged || link.isPublic,
  );

  return (
    <div className={cn(isMobile ? MOBILE_CLASS : DESKTOP_CLASS)}>
      {availableLinks.map((link) => (
        <NavbarLink
          key={link.href}
          href={link.href}
          isActive={link.href === pathname}
          isMobile={isMobile}
        >
          {link.label}
        </NavbarLink>
      ))}
    </div>
  );
}

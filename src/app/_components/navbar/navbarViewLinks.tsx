"use client";

import { type Session } from "next-auth";
import { NavbarLink } from "./navbarLink";
import { usePathname } from "next/navigation";

import cn from "classnames";
import { APP_ROUTES } from "@/shared/server-routes";

type MobileViewProps = {
  user: Session["user"] | undefined;
  isMobile?: boolean;
};

const MOBILE_CLASS = "space-y-1 px-2 py-2";
const DESKTOP_CLASS = "flex space-x-4";

export default function NavbarViewLinks({ user, isMobile }: MobileViewProps) {
  const isLogged = user !== undefined;

  const pathname = usePathname();

  const availableLinks = APP_ROUTES.filter((link) => isLogged || link.isPublic);

  return (
    <div className={cn(isMobile ? MOBILE_CLASS : DESKTOP_CLASS)}>
      {availableLinks.map((link) => (
        <NavbarLink
          key={link.href}
          href={link.inConstruction ? "/en_construccion" : link.href}
          isActive={link.href.split("/")[1] === pathname.split("/")[1]}
          isMobile={isMobile}
        >
          {link.label}
        </NavbarLink>
      ))}
    </div>
  );
}

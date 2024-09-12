import Link from "next/link";
import cn from "classnames";
import { DisclosureButton } from "@headlessui/react";

type NavbarLinkProps = {
  href?: string;
  children: React.ReactNode | string;
  isActive?: boolean;
  isMobile?: boolean;
};

const BASE_CLASS = "rounded-md px-3 py-2 font-medium";

const MOBILE_CLASS = "block text-base";
const DESKTOP_CLASS = "text-sm";

const BASE_STYLE_ACTIVE = "bg-blue-500 dark:bg-gray-900 text-white";
const BASE_STYLE_NO_ACTIVE = "text-gray-100 hover:bg-slate-100 dark:hover:bg-gray-700";

export const NavbarLink = ({ href = "/", children, isActive, isMobile }: NavbarLinkProps) => {
  const mobileClass = isMobile ? MOBILE_CLASS : DESKTOP_CLASS;
  const activeClass = isActive ? BASE_STYLE_ACTIVE : BASE_STYLE_NO_ACTIVE;

  if (isMobile) {
    return (
      <DisclosureButton
        as="a"
        href={href}
        aria-current={isActive ? "page" : undefined}
        className={cn(BASE_CLASS, mobileClass, activeClass)}
      >
        {children}
      </DisclosureButton>
    );
  } else {
    return (
      <Link
        href={href}
        aria-current={isActive ? "page" : undefined}
        className={cn(BASE_CLASS, mobileClass, activeClass)}
      >
        {children}
      </Link>
    );
  }
};

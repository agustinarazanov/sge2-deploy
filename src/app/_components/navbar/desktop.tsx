"use client";

import { usePathname } from "next/navigation";
import { APP_ROUTES } from "@/shared/server-routes";
import { Bell } from "lucide-react";
import { MenuItem } from "@headlessui/react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const DesktopNavigation = ({ isLogged }: { isLogged: boolean }) => {
  const pathname = usePathname();
  return (
    <div className="flex items-baseline space-x-4">
      {APP_ROUTES.filter((item) => isLogged || item.isPublic).map((item) => {
        const current = item.href.split("/")[1] === pathname.split("/")[1];
        return (
          <a
            key={item.label}
            href={item.href}
            aria-current={current ? "page" : undefined}
            className={classNames(
              current ? "bg-slate-100 text-black" : "text-gray-300 hover:bg-slate-50 hover:text-black",
              "rounded-md px-3 py-2 text-sm font-medium",
            )}
          >
            {item.label}
          </a>
        );
      })}
    </div>
  );
};

export const DesktopNotificationButton = () => (
  <button
    type="button"
    className="relative rounded-full bg-gray-500 p-1 text-gray-100 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
  >
    <span className="absolute -inset-1.5" />
    <span className="sr-only">View notifications</span>
    <Bell aria-hidden="true" className="h-6 w-6" />
  </button>
);

export const ProfileMenuItem = ({ key, href, label }: { key: string; href: string; label: string }) => (
  <MenuItem key={key}>
    <a href={href} className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-slate-100">
      {label}
    </a>
  </MenuItem>
);

"use client";

import { DisclosureButton } from "@headlessui/react";
import { usePathname } from "next/navigation";
import { APP_ROUTES, USER_ROUTES } from "@/shared/server-routes";
import { Bell } from "lucide-react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const MobileNavigation = ({ isLogged }: { isLogged: boolean }) => {
  const pathname = usePathname();
  return APP_ROUTES.filter((link) => isLogged || link.isPublic).map((item) => {
    const current = item.href.split("/")[1] === pathname.split("/")[1];
    return (
      <DisclosureButton
        key={item.label}
        as="a"
        href={item.href}
        aria-current={current ? "page" : undefined}
        className={classNames(
          current ? "bg-slate-200 text-black" : "text-gray-100",
          "block rounded-md px-3 py-2 text-base font-medium",
        )}
      >
        {item.label}
      </DisclosureButton>
    );
  });
};

export const ProfilePanel = ({ id }: { id: string }) =>
  USER_ROUTES(id).map((item) => (
    <DisclosureButton
      key={item.label}
      as="a"
      href={item.href}
      className="block rounded-md px-3 py-2 text-base font-medium text-gray-100 hover:bg-gray-700 hover:text-white"
    >
      {item.label}
    </DisclosureButton>
  ));

export const MobileNotificationButton = () => (
  <button
    type="button"
    className="relative ml-auto flex-shrink-0 rounded-full p-1 text-gray-100 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
  >
    <span className="absolute -inset-1.5" />
    <span className="sr-only">View notifications</span>
    <Bell aria-hidden="true" className="h-6 w-6" />
  </button>
);

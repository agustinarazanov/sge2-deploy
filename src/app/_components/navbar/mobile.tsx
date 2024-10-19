"use client";

import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { APP_ROUTES, USER_ROUTES } from "@/shared/server-routes";
import { Bell, ChevronDownIcon } from "lucide-react";

export const MobileNavigation = ({ isLogged }: { isLogged: boolean }) => {
  return APP_ROUTES.filter((link) => isLogged || link.isPublic).map((item) => {
    return (
      <Disclosure key={item.label} as="div" className="-mx-1">
        {item.subRutas ? (
          <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base leading-7 text-gray-900 hover:bg-gray-50">
            {item.label}
            <ChevronDownIcon aria-hidden="true" className="h-5 w-5 flex-none group-data-[open]:rotate-180" />
          </DisclosureButton>
        ) : (
          <DisclosureButton
            as="a"
            href={item.href}
            className="group flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base leading-7 text-gray-900 hover:bg-gray-50"
          >
            {item.label}
          </DisclosureButton>
        )}
        {item.subRutas && (
          <DisclosurePanel className="mt-2 space-y-2">
            {item.subRutas?.map((item) => (
              <DisclosureButton
                key={item.label}
                as="a"
                href={item.href}
                className="block rounded-lg py-2 pl-6 pr-3 text-sm leading-7 text-gray-900 hover:bg-gray-50"
              >
                {item.label}
              </DisclosureButton>
            ))}
          </DisclosurePanel>
        )}
      </Disclosure>
    );
  });
};

export const ProfilePanel = ({ id }: { id: string }) =>
  USER_ROUTES(id).map((item) => (
    <DisclosureButton
      key={item.label}
      as="a"
      href={item.href}
      className="group flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base leading-7 text-gray-900 hover:bg-gray-50"
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

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import UserPhoto from "../user-photo";
import { type Session } from "next-auth";
import Link from "next/link";

export default function UserIcon(user: Session["user"] | undefined) {
  return (
    <Menu as="div" className="relative ml-3">
      <div>
        <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
          <span className="absolute -inset-1.5" />
          <span className="sr-only">Open user menu</span>
          <UserPhoto />
        </MenuButton>
      </div>
      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-slate-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in dark:divide-gray-400 dark:bg-gray-900"
      >
        <div className="py-1">
          <MenuItem>
            <span className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-slate-100 dark:text-gray-100 dark:data-[focus]:bg-black">
              Sesión iniciada como <strong>{user?.name}</strong>
            </span>
          </MenuItem>
        </div>
        <div className="py-1">
          <MenuItem>
            <Link
              href={user?.id ? `/perfil/${user.id}` : "#"}
              className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-slate-100 dark:text-gray-100 dark:data-[focus]:bg-black"
            >
              Mi perfil
            </Link>
          </MenuItem>
          <MenuItem>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-slate-100 dark:text-gray-100 dark:data-[focus]:bg-black"
            >
              Preferencias
            </a>
          </MenuItem>
          <MenuItem>
            <a
              href="/api/auth/signout"
              className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-slate-100 dark:text-gray-100 dark:data-[focus]:bg-black"
            >
              Cerrar sesión
            </a>
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  );
}

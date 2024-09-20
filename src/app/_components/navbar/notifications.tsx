import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

const notifications = [
  {
    href: "#",
    type: "Reserva de laboratorio",
    message: "Laboratorio 1 - 12/10/2021 - 10:00 hs",
    user: "Juan Pérez",
  },
  {
    href: "#",
    type: "Reserva de laboratorio",
    message: "Laboratorio 2 - 12/10/2021 - 19:00 hs",
    user: "María Gómez",
  },
  {
    href: "#",
    type: "Reserva de laboratorio",
    message: "Laboratorio 3 - 12/10/2021 - 14:00 hs",
    user: "Sancho Panza",
  },
];

export default function Notifications() {
  return (
    <Menu as="div" className="relative ml-3">
      <div>
        <MenuButton className="relative rounded-full p-1 text-slate-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 dark:bg-gray-500 dark:text-gray-100 dark:hover:text-white">
          <span className="absolute -inset-1.5" />
          <span className="sr-only">View notifications</span>
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
            />
          </svg>
        </MenuButton>
      </div>
      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in dark:bg-gray-900"
      >
        {notifications.map((notification) => {
          return (
            <MenuItem key={notification.href}>
              <a
                href={notification.href}
                className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-slate-100 dark:text-gray-100 dark:data-[focus]:bg-black"
              >
                <p>
                  <strong>{notification.type}</strong>
                </p>
                <p>{notification.message}</p>
                <p>
                  <em>{notification.user}</em>
                </p>
              </a>
            </MenuItem>
          );
        })}
      </MenuItems>
    </Menu>
  );
}

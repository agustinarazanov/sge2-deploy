"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { api, type RouterOutputs } from "@/trpc/react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

type NotificaionType = RouterOutputs["notificacion"]["getPendientes"];

export default function Notifications() {
  const { data: notificaciones, isLoading, isError } = api.notificacion.getPendientes.useQuery();

  const notif = notificaciones ?? [];

  return (
    <Menu as="div" className="relative ml-3">
      <div>
        <MenuButton className="relative rounded-full p-1 text-slate-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
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
        <NotificacionBadge notifLength={notif.length} />
      </div>
      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <NotificationItems notificaciones={notif} isLoading={isLoading} isError={isError} />
      </MenuItems>
    </Menu>
  );
}

const NotificationItems = ({
  notificaciones,
  isLoading,
  isError,
}: {
  notificaciones: NotificaionType;
  isLoading: boolean;
  isError: boolean;
}) => {
  if (isLoading) {
    return (
      <>
        <MenuItem as="div">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-full" />
          </div>
        </MenuItem>
      </>
    );
  }

  if (isError) {
    return <></>;
  }

  if (!notificaciones.length) {
    return (
      <MenuItem as="div" className="p-4">
        <p>
          <b>No hay notificaciones</b>
        </p>
      </MenuItem>
    );
  }

  return (
    <>
      {notificaciones.map((notificacion) => {
        return (
          <MenuItem key={`${notificacion.link}-${notificacion.id}`} as="div">
            <NotificationItem notificacion={notificacion} />
          </MenuItem>
        );
      })}
    </>
  );
};

const NotificationItem = ({ notificacion }: { notificacion: NotificaionType[number] }) => {
  return (
    <Link
      href={notificacion.link ?? "#"}
      passHref
      prefetch
      className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-800 data-[focus]:bg-slate-100"
    >
      <p>
        <b>{notificacion.titulo}</b>
      </p>
      <p>{notificacion.descripcion}</p>
    </Link>
  );
};

const NotificacionBadge = ({ notifLength }: { notifLength: number }) => {
  if (notifLength === 0) {
    return <></>;
  }

  return (
    <Badge variant={"default"} color={"success"} className="absolute bottom-0 right-0 z-10 p-0 ">
      <div className="flex h-3 w-3 items-center justify-center">{notifLength}</div>
    </Badge>
  );
};

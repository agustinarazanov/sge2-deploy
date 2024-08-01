"use client";

import { useRouter } from "next/navigation";
import { EquipoForm } from "./equipo-form";
import { EQUIPOS_ROUTE } from "@/shared/server-routes";

type PageProps = {
  params: { id?: string };
};

const equipoRuta = EQUIPOS_ROUTE;

export default function PageEquipoDetails({ params: { id } }: PageProps) {
  const router = useRouter();

  const handleClickCancel = () => router.back();

  const handleClickSave = () => router.push(equipoRuta.href);

  return (
    <>
      <EquipoForm id={id} onCancel={handleClickCancel} onSubmit={handleClickSave} />
    </>
  );
}

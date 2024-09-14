"use client";

import { useRouter } from "next/navigation";
import { EQUIPOS_ROUTE } from "@/shared/server-routes";
import { TipoForm } from "./tipo-form";

type PageProps = {
  params: { id: string };
};

const rutaEquipos = EQUIPOS_ROUTE;

export default function PageTiposDetails({ params: { id } }: PageProps) {
  const router = useRouter();

  const handleClickCancel = () => router.back();

  const handleClickSave = () => router.push(rutaEquipos.href);

  return (
    <>
      <TipoForm id={id} onCancel={handleClickCancel} onSubmit={handleClickSave} />
    </>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { EquipoView } from "./equipo-view";

type PageProps = {
  params: { id?: string };
};

export default function PageEquipoDetails({ params: { id } }: PageProps) {
  const router = useRouter();

  const handleClickCancel = () => router.back();

  return (
    <>
      <EquipoView id={id} onCancel={handleClickCancel} />
    </>
  );
}

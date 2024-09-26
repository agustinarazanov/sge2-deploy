"use client";

import { useRouter } from "next/navigation";
import { LaboratorioCerradoForm } from "../../_components/reserva-form";
import { LABORATORIO_ROUTE } from "@/shared/server-routes";

type PageProps = {
  params: { id: string };
};

const laboratorioRuta = LABORATORIO_ROUTE;

export default function PageCursosDetails({ params: { id } }: PageProps) {
  const router = useRouter();

  const handleClickCancel = () => router.back();

  const handleClickSave = () => router.push(laboratorioRuta.href);

  return (
    <>
      <LaboratorioCerradoForm cursoId={id} onCancel={handleClickCancel} onSubmit={handleClickSave} />
    </>
  );
}

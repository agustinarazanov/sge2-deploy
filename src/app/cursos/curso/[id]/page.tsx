"use client";

import { useRouter } from "next/navigation";
import { CursoForm } from "./curso-form";
import { CURSOS_ROUTE } from "@/shared/server-routes";

type PageProps = {
  params: { id?: string };
};

const cursoRuta = CURSOS_ROUTE;

export default function PageCursosDetails({ params: { id } }: PageProps) {
  const router = useRouter();

  const handleClickCancel = () => {
    setTimeout(() => router.refresh(), 100); // Hack para que primero recargue la pagina y luego haga el back, de otra forma el back cancela el refresh
  };

  const handleClickSave = () => router.push(cursoRuta.href);

  return (
    <>
      <CursoForm id={id} onCancel={handleClickCancel} onSubmit={handleClickSave} />
    </>
  );
}

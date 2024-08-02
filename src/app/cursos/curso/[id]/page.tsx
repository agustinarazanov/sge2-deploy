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

  const handleClickCancel = () => router.back();

  const handleClickSave = () => router.push(cursoRuta.href);

  return (
    <>
      <CursoForm id={id} onCancel={handleClickCancel} onSubmit={handleClickSave} />
    </>
  );
}

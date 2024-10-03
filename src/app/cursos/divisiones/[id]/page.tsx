"use client";

import { useRouter } from "next/navigation";
import { DivisionForm } from "./division-form";
import { CURSOS_ROUTE } from "@/shared/server-routes";
import React from "react";
type PageProps = {
  params: { id?: string };
};
const rutaCurso = CURSOS_ROUTE.subRutas[2];
export default function PageDivisionDetails({ params: { id } }: PageProps) {
  const router = useRouter();

  const handleClickCancel = () => router.back();

  const handleClickSave = () => router.push(rutaCurso?.href ?? "");

  return (
    <>
      <DivisionForm id={id} onCancel={handleClickCancel} onSubmit={handleClickSave} />
    </>
  );
}

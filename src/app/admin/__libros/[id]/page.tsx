"use client";

import { useRouter } from "next/navigation";
import { LibroForm } from "./libro-form";

type PageProps = {
  params: { id?: string };
};

export default function PageLibroDetails({ params: { id } }: PageProps) {
  const router = useRouter();

  const handleClickCancel = () => router.back();

  const handleClickSave = () => router.push("/biblioteca");

  return (
    <>
      <LibroForm id={id} onCancel={handleClickCancel} onSubmit={handleClickSave} />
    </>
  );
}

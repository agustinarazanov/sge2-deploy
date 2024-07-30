"use client";

import { useRouter } from "next/navigation";
import { LibroForm } from "./libro-form";
import { LibroFormButtons } from "./libro-form-buttons";

type PageProps = {
  params: { id?: string };
};

export default function PageLibroDetails({ params: { id } }: PageProps) {
  const router = useRouter();

  const handleClickCancel = () => {
    router.back();
  };

  const handleClickSave = () => {
    router.push("/biblioteca");
  };

  return (
    <>
      <LibroForm id={id} />
      <LibroFormButtons handleClickCancel={handleClickCancel} handleClickSave={handleClickSave} />
    </>
  );
}

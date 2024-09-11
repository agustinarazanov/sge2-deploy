"use client";

import { useRouter } from "next/navigation";
import { LibroView } from "./libro-view";

type PageProps = {
  params: { id?: string };
};

export default function PageLibroDetails({ params: { id } }: PageProps) {
  const router = useRouter();

  const handleClickCancel = () => router.back();

  return (
    <>
      <LibroView id={id} onCancel={handleClickCancel} />
    </>
  );
}

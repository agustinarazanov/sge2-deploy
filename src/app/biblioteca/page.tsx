import { type ReadonlyURLSearchParams } from "next/navigation";
import { ActionButtons } from "./_components/action-buttons";
import BibliotecaTableContainer from "./_components/biblioteca-table-container";

type PageProps = {
  searchParams: ReadonlyURLSearchParams;
};

export default async function Page({ searchParams }: PageProps) {
  return (
    <>
      <ActionButtons />

      <BibliotecaTableContainer searchParams={searchParams} />
    </>
  );
}

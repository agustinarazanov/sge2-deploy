"use server";

type LayoutProps = {
  children: React.ReactNode;
  modal: React.ReactNode;
};

export default async function Layout({ children, modal }: LayoutProps) {
  return (
    <>
      <main className="flex w-full flex-col">
        <div className="flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          {children}
          {modal}
        </div>
      </main>
    </>
  );
}

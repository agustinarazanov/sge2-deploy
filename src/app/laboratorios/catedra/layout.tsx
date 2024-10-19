"use server";

type LayoutProps = {
  children: React.ReactNode;
  modal: React.ReactNode;
};

export default async function Layout({ children, modal }: LayoutProps) {
  return (
    <main className="flex flex-col">
      {children}
      {modal}
    </main>
  );
}

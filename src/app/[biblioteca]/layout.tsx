"use server";

type LayoutProps = {
  children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  const numero = 27;

  return (
    <div>
      <h1>Layout {numero}</h1>
      <div className="bg-red-400">{children}</div>
    </div>
  );
}

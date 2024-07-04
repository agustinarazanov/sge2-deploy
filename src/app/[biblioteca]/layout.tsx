"use server";

type LayoutProps = {
  children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        {children}
      </div>
    </main>
  );
}

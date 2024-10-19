"use server";

type LayoutProps = {
  children: React.ReactNode;
};

export default async function Layout({ children }: LayoutProps) {
  return <div className="flex w-full flex-col">{children}</div>;
}

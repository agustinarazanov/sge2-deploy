"use server";

type LayoutProps = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: LayoutProps) {
  return <main className="flex flex-col">{children}</main>;
}

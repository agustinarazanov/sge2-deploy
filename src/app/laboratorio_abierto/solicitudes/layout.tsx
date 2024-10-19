type LayoutProps = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: LayoutProps) {
  return <div className="flex w-full flex-col">{children}</div>;
}

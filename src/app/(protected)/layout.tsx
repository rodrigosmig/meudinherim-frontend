import { getSessionToken } from "@/helpers/session";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = await getSessionToken();

  if (!token) {
    redirect("/login");
  }

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header.Root title="Categoria" />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

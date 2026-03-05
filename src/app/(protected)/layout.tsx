import { getSessionToken } from "@/helpers/session-server-helper";
import { QueryProvider } from "@/providers/query-provider";
import { HeaderProvider } from "@/contexts/header-context";
import { DefaultHeader } from "@/components/header/header";
import { DataProvider } from "@/providers/data-provider";
import { Sidebar } from "@/components/sidebar";
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
    <QueryProvider>
      <DataProvider>
        <HeaderProvider>
          <div className="h-screen flex overflow-hidden">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
              <DefaultHeader />
              <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
          </div>
        </HeaderProvider>
      </DataProvider>
    </QueryProvider>
  );
}

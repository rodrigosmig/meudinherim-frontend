import { InitialConfigDataProvider } from "@/providers/data-provider";
import { DateFilterProvider } from "@/contexts/date-filter-context";
import { getSessionToken } from "@/helpers/session-server-helper";
import { QueryProvider } from "@/providers/query-provider";
import { HeaderProvider } from "@/contexts/header-context";
import { DefaultHeader } from "@/components/header/header";
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
      <InitialConfigDataProvider>
        <HeaderProvider>
          <div className="h-screen flex overflow-hidden">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
              <DefaultHeader />
              <DateFilterProvider>
                <main className="flex-1 overflow-y-auto p-6 relative main-content-area animate-in fade-in slide-in-from-bottom-2 duration-300">{children}</main>
              </DateFilterProvider>
            </div>
          </div>
        </HeaderProvider>
      </InitialConfigDataProvider>
    </QueryProvider>
  );
}

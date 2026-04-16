import { LoggedNav } from "@/components/LoggedNavbar";
import { WorkspacesPage } from "@/components/pages/WorkspacesPage";
import { SideBar } from "@/components/Sidebar";
import { getSession } from "@/getSession";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/signin");
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <SideBar />
      <div className="flex flex-col w-full">
        <LoggedNav />
        <div className="flex-1 overflow-y-auto">
          <WorkspacesPage />
        </div>
      </div>
    </div>
  );
}

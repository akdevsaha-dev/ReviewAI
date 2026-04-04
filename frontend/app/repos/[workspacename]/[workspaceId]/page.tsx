import { LoggedNav } from "@/components/LoggedNavbar";
import { PullRequestsPage } from "@/components/PullRequestsPage";
import { SideBar } from "@/components/Sidebar";
import { getSession } from "@/getSession";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ workspacename: string; workspaceId: string }>;
}) {
  const { workspacename, workspaceId } = await params;
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
          <PullRequestsPage
            workspaceId={workspaceId}
            workspaceName={workspacename}
          />
        </div>
      </div>
    </div>
  );
}

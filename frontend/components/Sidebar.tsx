"use client";

import { GitBranch, LayoutDashboard, Settings, Wallet } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export const SideBar = () => {
  const params = useParams();
  const pathname = usePathname();

  const workspaceName = (params.workspacename ||
    params.workspaceName) as string;
  const workspaceId = params.workspaceId as string;

  if (!workspaceId || !workspaceName) throw new Error("Cannot load");

  const items = [
    {
      label: "Dashboard",
      href: `/dashboard/${workspaceName}/${workspaceId}`,
      icon: LayoutDashboard,
    },
    {
      label: "Pull Requests",
      href: `/repos/${workspaceName}/${workspaceId}`,
      icon: GitBranch,
    },
    { label: "Workspaces", href: `/workspaces`, icon: Wallet },
    {
      label: "Settings",
      href: `/settings/${workspaceName}/${workspaceId}`,
      icon: Settings,
    },
  ];

  return (
    <div className="h-screen flex flex-col w-62.5 border-r dark:border-r-neutral-800 border-r-neutral-200 dark:bg-[#0e0e10] bg-neutral-100 ">
      <div className="flex items-center gap-4 h-16 px-5">
        <img
          src="https://cdn.simpleicons.org/bluesound/white?viewbox=auto&size=24"
          className="hidden dark:block"
        />

        <img
          src="https://cdn.simpleicons.org/bluesound/black?viewbox=auto&size=24"
          className="block dark:hidden"
        />
        <div className="text-xl font-semibold">PRwise</div>
      </div>
      <div className="h-full mx-2 space-y-1 mt-2">
        {items.map((item) => {
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex text-sm items-center gap-2 p-2 rounded-md transition-colors
        ${isActive ? "dark:bg-neutral-800 bg-neutral-300 dark:text-white text-black" : "dark:text-zinc-400 text-neutral-700 dark:hover:bg-neutral-900 hover:bg-neutral-200"}`}
            >
              <item.icon className="w-4 h-4" />
              <span className="">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

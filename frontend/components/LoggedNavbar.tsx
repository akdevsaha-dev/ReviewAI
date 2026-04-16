"use client";
import { useRepoStore } from "@/store/repoStore";
import { useUserStore } from "@/store/userStore";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect } from "react";

export const LoggedNav = () => {
  const params = useParams();
  const pathname = usePathname();
  const firstPath = pathname.split("/")[1] || "";
  const sectionLabel =
    firstPath === "repos"
      ? "Pull requests"
      : firstPath.charAt(0).toUpperCase() + firstPath.slice(1);

  const workspaceId = Array.isArray(params.workspaceId)
    ? params.workspaceId[0]
    : params.workspaceId;

  const connected = useRepoStore((state) => state.connected);
  const isGettingStatus = useRepoStore((state) => state.isGettingStatus);
  const getRepoStatus = useRepoStore((state) => state.getRepoStatus);

  const isGettingUser = useUserStore((state) => state.isGettingUser);
  const user = useUserStore((state) => state.user);
  const fetchUser = useUserStore((state) => state.fetchUser);

  const connectRepoUrl = workspaceId
    ? `https://github.com/apps/prwise-ai/installations/new?state=${workspaceId}`
    : "/onboarding/workspace-setup";

  useEffect(() => {
    if (workspaceId) {
      getRepoStatus({ workspaceId });
    }
  }, [workspaceId, getRepoStatus]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <div className="w-full h-14 dark:bg-[#0e0e10] bg-neutral-100 border-b dark:border-b-neutral-800 border-b-neutral-300 px-4 flex items-center justify-between">
      {/* Left */}
      <div className="flex gap-2 items-center">
        <div className="font-semibold dark:text-white text-black">PRwise</div>
        <div className="dark:text-neutral-400 text-neutral-500">/</div>
        <div className="text-sm dark:text-neutral-400 text-neutral-500">
          {sectionLabel}
        </div>
      </div>

      <div className="flex gap-5 items-center">
        <div className="text-sm">
          {isGettingStatus ? (
            <div className="flex items-center gap-2 px-3 py-2 rounded-2xl dark:bg-neutral-800 bg-neutral-200 animate-pulse">
              <div className="w-3.5 h-3.5 rounded bg-neutral-300 dark:bg-neutral-700"></div>
              <div className="w-24 h-3 rounded bg-neutral-300 dark:bg-neutral-700"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700"></div>
            </div>
          ) : connected ? (
            <div className="flex mt-1 items-center justify-center text-xs font-semibold px-2 dark:text-neutral-400 text-neutral-800 py-1 dark:bg-neutral-800 bg-neutral-200 gap-2 rounded-2xl">
              <Image
                src="https://cdn.simpleicons.org/github/white"
                alt="GitHub"
                width={14}
                height={14}
                unoptimized
                className="hidden dark:block"
              />
              <Image
                src="https://cdn.simpleicons.org/github/black"
                alt="GitHub"
                width={14}
                height={14}
                unoptimized
                className="block dark:hidden"
              />

              <div>GitHub Connected</div>
              <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
            </div>
          ) : (
            <Link
              href={connectRepoUrl}
              target={workspaceId ? "_blank" : undefined}
              rel={workspaceId ? "noreferrer" : undefined}
              className="flex items-center text-xs px-3 dark:text-neutral-400 text-neutral-700 py-2 dark:bg-neutral-800 bg-neutral-200 gap-2 rounded-2xl hover:opacity-90"
            >
              <Image
                src="https://cdn.simpleicons.org/github/white"
                alt="GitHub"
                width={14}
                height={14}
                unoptimized
                className="hidden dark:block"
              />
              <Image
                src="https://cdn.simpleicons.org/github/black"
                alt="GitHub"
                width={14}
                height={14}
                unoptimized
                className="block dark:hidden"
              />

              <div>Connect Github</div>
              <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
            </Link>
          )}
        </div>

        <div>
          {isGettingUser ? (
            <div className="w-8 h-8 rounded-full bg-neutral-300 dark:bg-neutral-700 animate-pulse"></div>
          ) : (
            <div suppressHydrationWarning>
              {user?.image ? (
                <Image
                  src={user.image}
                  alt="User avatar"
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                />
              ) : user?.email ? (
                <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-sm font-bold text-neutral-800 dark:text-neutral-200">
                  {user.email.charAt(0).toUpperCase()}
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

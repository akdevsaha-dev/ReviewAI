"use client";

import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { PullRequestsTable } from "@/components/dashboard/PullRequestsTable";
import { useDashboardStore } from "@/store/dashboardStore";
import { useRepoStore } from "@/store/repoStore";
import { axiosInstance } from "@/utils/instance";
import { Loader, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import { DashboardSkeleton } from "./ui/dashSkeleton";

type Props = {
  workspaceId: string;
  workspaceName: string;
};

export function PullRequestsPage({ workspaceId, workspaceName }: Props) {
  const router = useRouter();
  const displayWorkspaceName = decodeURIComponent(workspaceName);
  const connectRepoUrl = useMemo(
    () =>
      `https://github.com/apps/prwise-ai/installations/new?state=${workspaceId}`,
    [workspaceId],
  );

  const isDashboardLoading = useDashboardStore(
    (state) => state.isDashboardLoading,
  );
  const metrics = useDashboardStore((state) => state.metrics);
  const prs = useDashboardStore((state) => state.prs);
  const fetchDashboard = useDashboardStore((state) => state.fetchDashboard);

  const connected = useRepoStore((state) => state.connected);
  const installation = useRepoStore((state) => state.installation);
  const isGettingStatus = useRepoStore((state) => state.isGettingStatus);
  const getRepoStatus = useRepoStore((state) => state.getRepoStatus);

  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmWorkspaceName, setConfirmWorkspaceName] = useState("");
  const isDeleteEnabled = confirmWorkspaceName.trim() === displayWorkspaceName;

  useEffect(() => {
    fetchDashboard({ workspaceId });
  }, [fetchDashboard, workspaceId]);

  useEffect(() => {
    getRepoStatus({ workspaceId });
  }, [getRepoStatus, workspaceId]);

  const lastAnalysis = metrics?.lastAnalysis
    ? formatDistanceToNow(new Date(metrics.lastAnalysis), { addSuffix: true })
        .replace(" seconds", "s")
        .replace(" second", "s")
        .replace(" minutes", "m")
        .replace(" minute", "m")
        .replace(" hours", "h")
        .replace(" hour", "h")
        .replace(" days", "d")
        .replace(" day", "d")
        .replace(" months", "mo")
        .replace(" month", "mo")
        .replace(" years", "y")
        .replace(" year", "y")
    : "No analysis yet";

  const handleDisconnectRepo = async () => {
    if (!connected) {
      toast("No repository is connected to this workspace.");
      return;
    }
    const shouldContinue = window.confirm(
      "Disconnect the GitHub installation from this workspace?",
    );
    if (!shouldContinue) return;
    try {
      setIsDisconnecting(true);
      await axiosInstance.delete(
        `/v1/workspace/${workspaceId}/repo-connection`,
      );
      await getRepoStatus({ workspaceId });
      toast.success("Repository disconnected.");
    } catch (error) {
      console.error("Failed to disconnect repository", error);
      toast.error("Failed to disconnect repository.");
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handleDeleteWorkspace = async () => {
    if (!isDeleteEnabled) {
      toast.error("Type the workspace name to enable deletion.");
      return;
    }
    const shouldContinue = window.confirm(
      "This permanently deletes the workspace, pull requests, and analyses. Continue?",
    );
    if (!shouldContinue) return;
    try {
      setIsDeleting(true);
      await axiosInstance.delete(`/v1/workspace/${workspaceId}`);
      toast.success("Workspace deleted.");
      router.push("/onboarding/workspace-setup");
    } catch (error) {
      console.error("Failed to delete workspace", error);
      toast.error("Failed to delete workspace.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isDashboardLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-[200vh] w-full space-y-6 px-5 pb-10">
      <div>
        <h1 className="text-2xl font-semibold mt-5">Pull requests</h1>
        <p className="text-sm mt-1 dark:text-neutral-400 text-neutral-500">
          Track PRs, connect GitHub, and manage this workspace.
        </p>
      </div>

      <DashboardMetrics metrics={metrics} lastAnalysis={lastAnalysis} />

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border dark:border-neutral-800 border-neutral-300 dark:bg-neutral-900/60 bg-neutral-100 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-lg">Workspace</h2>
              <p className="text-sm mt-1 dark:text-neutral-400 text-neutral-500">
                {displayWorkspaceName}
              </p>
            </div>
            <span className="text-xs px-2 py-1 rounded-full dark:bg-neutral-800 bg-neutral-200 shrink-0">
              ID: {workspaceId}
            </span>
          </div>
          <Link
            href="/onboarding/workspace-setup"
            className="mt-4 inline-flex items-center gap-2 text-xs px-3 py-2 rounded-md dark:bg-[#5c4cd8]/90 bg-[#5c4cd8] text-white hover:opacity-90"
          >
            <Plus className="w-3.5 h-3.5" />
            Add workspace
          </Link>
        </section>

        <section className="rounded-xl border dark:border-neutral-800 border-neutral-300 dark:bg-neutral-900/60 bg-neutral-100 p-5">
          <h2 className="font-semibold text-lg">Repository</h2>
          <p className="text-sm mt-1 dark:text-neutral-400 text-neutral-500">
            Connect GitHub so PRwise can analyze pull requests.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {isGettingStatus ? (
              <div className="text-sm dark:text-neutral-400 text-neutral-500">
                Checking repository connection...
              </div>
            ) : connected ? (
              <div className="text-sm dark:text-green-400 text-green-600">
                Connected to {installation?.accountLogin ?? "GitHub"}
              </div>
            ) : (
              <div className="text-sm dark:text-red-300 text-red-600">
                No repository connected
              </div>
            )}
            <Link
              href={connectRepoUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs px-3 py-2 rounded-md dark:bg-neutral-800 bg-neutral-200 hover:opacity-90"
            >
              Connect repository
            </Link>
            <button
              type="button"
              onClick={handleDisconnectRepo}
              disabled={!connected || isDisconnecting}
              className="text-xs px-3 py-2 rounded-md border dark:border-neutral-700 border-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDisconnecting ? (
                <span className="flex items-center gap-2">
                  <Loader className="animate-spin" size={14} />
                  Disconnecting...
                </span>
              ) : (
                "Disconnect repository"
              )}
            </button>
          </div>
        </section>
      </div>

      <section className="rounded-xl border border-red-500/40 bg-red-500/5 p-5">
        <h2 className="font-semibold text-lg text-red-400">Danger zone</h2>
        <p className="text-sm mt-1 text-red-300/90">
          Delete this workspace permanently.
        </p>
        <div className="mt-4 space-y-3">
          <div className="text-xs text-red-300">
            Type <span className="font-semibold">{displayWorkspaceName}</span>{" "}
            to confirm.
          </div>
          <input
            value={confirmWorkspaceName}
            onChange={(e) => setConfirmWorkspaceName(e.target.value)}
            className="w-full md:w-96 px-3 py-2 rounded-md bg-transparent border border-red-500/40 focus:outline-none"
            placeholder={displayWorkspaceName}
          />
          <button
            type="button"
            onClick={handleDeleteWorkspace}
            disabled={!isDeleteEnabled || isDeleting}
            className="text-sm px-3 py-2.5 rounded-md bg-red-500/80 hover:bg-red-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <span className="flex items-center gap-2">
                <Loader className="animate-spin" size={14} />
                Deleting workspace...
              </span>
            ) : (
              "Delete workspace"
            )}
          </button>
        </div>
      </section>

      <PullRequestsTable prs={prs} title="All pull requests" />
    </div>
  );
}

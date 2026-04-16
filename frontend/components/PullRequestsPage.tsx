"use client";

import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { PullRequestsTable } from "@/components/dashboard/PullRequestsTable";
import { useDashboardStore } from "@/store/dashboardStore";
import { useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { DashboardSkeleton } from "./ui/dashSkeleton";

type Props = {
  workspaceId: string;
  workspaceName: string;
};

export function PullRequestsPage({ workspaceId, workspaceName }: Props) {
  const isDashboardLoading = useDashboardStore(
    (state) => state.isDashboardLoading,
  );
  const metrics = useDashboardStore((state) => state.metrics);
  const prs = useDashboardStore((state) => state.prs);
  const fetchDashboard = useDashboardStore((state) => state.fetchDashboard);

  useEffect(() => {
    fetchDashboard({ workspaceId });
  }, [fetchDashboard, workspaceId]);

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

  if (isDashboardLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen w-full space-y-6 px-6 py-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Pull Requests</h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          View and manage all pull requests for the <span className="font-semibold text-neutral-900 dark:text-neutral-100">{decodeURIComponent(workspaceName)}</span> workspace.
        </p>
      </div>

      <div className="pt-4">
        <PullRequestsTable prs={prs} title="All pull requests" />
      </div>
    </div>
  );
}

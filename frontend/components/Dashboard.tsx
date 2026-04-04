"use client";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { PullRequestsTable } from "@/components/dashboard/PullRequestsTable";
import { useDashboardStore } from "@/store/dashboardStore";
import { useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { DashboardSkeleton } from "./ui/dashSkeleton";

export const Dashboard = ({ workspaceId }: { workspaceId: string }) => {
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
    <div className="min-h-[200vh] w-full space-y-6 px-5">
      <DashboardMetrics metrics={metrics} lastAnalysis={lastAnalysis} />
      <div>
        <PullRequestsTable prs={prs} />
      </div>
    </div>
  );
};

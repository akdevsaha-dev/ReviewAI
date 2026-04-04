"use client";
import { useDashboardStore } from "@/store/dashboardStore";
import {
  ChartColumn,
  Clock,
  Eye,
  GitPullRequest,
  TriangleAlert,
} from "lucide-react";
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

  function getRiskColor(score: number) {
    if (score >= 70) return "bg-red-500/20 text-red-400 border-red-500/40";
    if (score >= 40)
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/40";
    return "bg-green-500/20 text-green-400 border-green-500/40";
  }

  function getStatusColor(status: string) {
    if (status === "Open") return "bg-green-500/20 text-green-400";
    if (status === "Merged") return "bg-purple-500/20 text-purple-400";
    return "bg-gray-500/20 text-gray-400";
  }

  if (isDashboardLoading) {
    return <DashboardSkeleton />;
  }
  return (
    <div className="min-h-[200vh] w-full space-y-6 px-5">
      <div className="w-full gap-3 flex mt-5 ">
        <div className="flex-1 flex justify-between px-4 py-5 h-34 rounded-lg dark:bg-neutral-900/70 bg-neutral-100 border dark:border-neutral-800 border-neutral-300">
          <div>
            <div className="text-xs font-semibold text-neutral-500">
              Total PRs Analyzed
            </div>
            <div className="text-2xl font-bold mt-7">{metrics?.totalPRs}</div>
            <div></div>
          </div>
          <div>
            <div className="p-2 bg-sky-800/10 rounded-md ">
              <GitPullRequest size={16} className="text-blue-500 " />
            </div>
          </div>
        </div>
        <div className="flex-1 flex justify-between px-4 py-5 h-34 rounded-lg dark:bg-neutral-900/70 bg-neutral-100 border dark:border-neutral-800 border-neutral-300">
          <div>
            <div className="text-xs font-semibold text-neutral-400">
              Open PRs
            </div>
            <div className="text-2xl font-bold mt-7">{metrics?.openPRs}</div>
            <div></div>
          </div>
          <div>
            <div className="p-2 bg-violet-800/10 rounded-md ">
              <Eye size={16} className="text-violet-500 " />
            </div>
          </div>
        </div>
        <div className="flex-1 flex justify-between px-4 py-5 h-34 rounded-lg dark:bg-neutral-900/70 bg-neutral-100 border dark:border-neutral-800 border-neutral-300">
          <div>
            <div className="text-xs font-semibold text-neutral-500">
              High Risk PRs
            </div>
            <div className="text-2xl font-bold mt-7">
              {metrics?.highRiskPRs}
            </div>
            <div className="text-sm text-neutral-500">Requires attention</div>
          </div>
          <div>
            <div className="p-2 bg-red-800/10 rounded-md ">
              <TriangleAlert size={16} className="text-red-500 " />
            </div>
          </div>
        </div>
        <div className="flex-1 flex justify-between px-4 py-5 h-34 rounded-lg dark:bg-neutral-900/70 bg-neutral-100 border dark:border-neutral-800 border-neutral-300">
          <div>
            <div className="text-xs font-semibold text-neutral-500">
              Avg Risk Score
            </div>
            <div className="text-2xl font-bold mt-7">
              {metrics?.avgRiskScore ? metrics.avgRiskScore.toFixed(1) : "0"}
            </div>
            <div></div>
          </div>
          <div>
            <div className="p-2 bg-amber-800/10 rounded-md ">
              <ChartColumn size={16} className="text-amber-500 " />
            </div>
          </div>
        </div>
        <div className="flex-1 flex justify-between px-4 py-5 h-34 rounded-lg dark:bg-neutral-900/70 bg-neutral-100 border dark:border-neutral-800 border-neutral-300">
          <div>
            <div className="text-xs font-semibold text-neutral-500">
              Last Analysis
            </div>
            <div className="text-2xl font-bold mt-7">{lastAnalysis}</div>
            <div className="text-sm text-neutral-500">Auto-analyzing</div>
          </div>
          <div>
            <div className="p-2 bg-green-800/20 rounded-md ">
              <Clock size={16} className="text-green-500 " />
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="dark:bg-[#141415] bg-neutral-100 border dark:border-white/10 border-neutral-300 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 text-lg font-semibold">
            Recent Pull Requests
          </div>

          <div className="h-100 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="dark:text-gray-400 text-neutral-500 sticky top-0 dark:bg-[#101011] bg-neutral-200 border-b border-white/10">
                <tr>
                  <th className="text-left px-6 py-3">PR Title</th>
                  <th className="text-left px-6 py-3">Repository</th>
                  <th className="text-left px-6 py-3">Author</th>
                  <th className="text-left px-6 py-3">Status</th>
                  <th className="text-left px-6 py-3">Risk</th>
                  <th className="text-left px-6 py-3">AI Review</th>
                  <th className="text-left px-6 py-3">Created</th>
                </tr>
              </thead>

              <tbody>
                {prs.map((pr) => (
                  <tr
                    key={pr.id}
                    className="border-b dark:border-white/5 border-black/5 dark:hover:bg-white/2 hover:bg-black/2 transition"
                  >
                    <td className="px-6 py-4 dark:text-white text-neutral-600 font-medium">
                      {pr.title}
                    </td>

                    <td className="px-6 py-4 text-gray-400 font-mono">
                      {pr.repoName}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full dark:bg-white/10 bg-black/30 flex items-center justify-center text-xs font-semibold text-gray-300">
                          {pr.author.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="dark:text-gray-300 text-gray-600">
                          {pr.author}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(
                          pr.state,
                        )}`}
                      >
                        {pr.state}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs rounded-full border font-semibold ${getRiskColor(
                          pr.analysis?.[0]?.bugRiskScore || 0,
                        )}`}
                      >
                        {pr.analysis?.[0]?.bugRiskScore || 0}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {pr.analysis?.[0]?.status === "pending" ? (
                        <span className="text-yellow-400 font-medium">
                          {"Analyzing..."}
                        </span>
                      ) : (
                        <span className="text-green-400 font-medium">
                          {"Reviewed"}
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-gray-400">
                      {new Date(pr.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

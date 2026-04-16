"use client";

import type { PR } from "@/store/dashboardStore";
import { getRiskColor, getStatusColor } from "./dashboardUtils";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ExternalLink, GitBranch, Terminal } from "lucide-react";

type Props = {
  prs: PR[];
  title?: string;
};

export function PullRequestsTable({
  prs,
  title = "Recent Pull Requests",
}: Props) {
  const params = useParams();
  const workspacename = params.workspacename as string;
  const workspaceId = params.workspaceId as string;

  return (
    <div className="dark:bg-[#0e0e10]/80 bg-white border dark:border-neutral-800 border-neutral-200 rounded-2xl overflow-hidden shadow-sm backdrop-blur-sm">
      <div className="px-6 py-5 border-b dark:border-neutral-800 border-neutral-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-neutral-400" />
          <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        </div>
        <div className="text-xs font-medium px-2 py-1 rounded-md dark:bg-neutral-800 bg-neutral-100 text-neutral-500">
          {prs.length} PRs found
        </div>
      </div>

      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-sm">
          <thead className="dark:text-neutral-400 text-neutral-500 sticky top-0 dark:bg-neutral-900/90 bg-neutral-50/90 backdrop-blur-md z-10 border-b dark:border-neutral-800 border-neutral-100">
            <tr>
              <th className="text-left px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Title</th>
              <th className="text-left px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Branch</th>
              <th className="text-left px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Author</th>
              <th className="text-left px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Status</th>
              <th className="text-left px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Risk Score</th>
              <th className="text-left px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">AI Status</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px] text-right">Created</th>
            </tr>
          </thead>

          <tbody className="divide-y dark:divide-neutral-800 divide-neutral-100">
            {prs.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-20 text-center text-neutral-500">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-lg font-medium">No pull requests found</p>
                    <p className="text-xs">Once you create a PR in GitHub, it will appear here.</p>
                  </div>
                </td>
              </tr>
            ) : (
              prs.map((pr) => (
                <tr
                  key={pr.id}
                  className="group dark:hover:bg-neutral-800/40 hover:bg-neutral-50/80 transition-all duration-200"
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/pullrequests/${workspacename}/${workspaceId}/pull/${pr.id}`}
                      className="flex flex-col gap-0.5"
                    >
                      <span className="dark:text-neutral-100 text-neutral-900 font-bold group-hover:text-blue-400 transition-colors uppercase">
                        {pr.title}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono flex items-center gap-1 uppercase">
                        #{pr.pullReqNumber} • {pr.repoName}
                      </span>
                    </Link>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-neutral-400 font-mono text-[11px] bg-neutral-100 dark:bg-neutral-800/50 px-2 py-1 rounded w-fit uppercase">
                      <GitBranch className="w-3 h-3" />
                      <span>{pr.branch}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-linear-to-br from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-800 flex items-center justify-center text-[10px] font-bold text-neutral-600 dark:text-neutral-400 border dark:border-neutral-600 border-neutral-300 shadow-sm">
                        {pr.author.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="dark:text-neutral-300 text-neutral-700 font-medium uppercase">
                        {pr.author}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 text-[10px] rounded-md font-bold uppercase tracking-tight shadow-sm border ${getStatusColor(
                        pr.state,
                      )}`}
                    >
                      {pr.state}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${pr.analysis?.[0]?.bugRiskScore > 70 ? 'bg-red-500 animate-pulse' : pr.analysis?.[0]?.bugRiskScore > 40 ? 'bg-yellow-500' : ' bg-green-500'}`} />
                      <span
                        className={`text-sm bg-transparent font-bold ${getRiskColor(
                          pr.analysis?.[0]?.bugRiskScore || 0,
                        )}`}
                      >
                        {pr.analysis?.[0]?.bugRiskScore || 0}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    {pr.analysis?.[0]?.status === "pending" ? (
                      <div className="flex items-center gap-2 text-yellow-500 font-bold text-[10px]">
                        <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce" />
                        ANALYZING
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-emerald-500 font-bold text-[10px]">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        COMPLETED
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="text-[11px] text-neutral-500 uppercase">
                        {new Date(pr.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </td>
                </tr>
              )
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import type { PR } from "@/store/dashboardStore";
import { getRiskColor, getStatusColor } from "./dashboardUtils";

type Props = {
  prs: PR[];
  title?: string;
};

export function PullRequestsTable({
  prs,
  title = "Recent Pull Requests",
}: Props) {
  return (
    <div className="dark:bg-[#141415] bg-neutral-100 border dark:border-white/10 border-neutral-300 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-white/10 text-lg font-semibold">
        {title}
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
                      Analyzing...
                    </span>
                  ) : (
                    <span className="text-green-400 font-medium">Reviewed</span>
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
  );
}

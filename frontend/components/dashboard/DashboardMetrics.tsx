"use client";

import type { Metrics } from "@/store/dashboardStore";
import {
  ChartColumn,
  Clock,
  Eye,
  GitPullRequest,
  TriangleAlert,
} from "lucide-react";

type Props = {
  metrics: Metrics | null;
  lastAnalysis: string;
};

export function DashboardMetrics({ metrics, lastAnalysis }: Props) {
  return (
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
          <div className="text-2xl font-bold mt-7">{metrics?.highRiskPRs}</div>
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
  );
}

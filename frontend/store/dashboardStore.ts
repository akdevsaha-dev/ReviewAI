import { axiosInstance } from "@/utils/instance";
import toast from "react-hot-toast";
import { create } from "zustand";

export type Metrics = {
  totalPRs: number;
  openPRs: number;
  highRiskPRs: number;
  avgRiskScore: number | null;
  lastAnalysis: string;
};
export type Analysis = {
  id: string;
  status: string | null;
  summary: string | null;
  suggestions: string | null;
  bugRiskScore: number;
  createdAt: string;
  updatedAt: string;
  pullRequestId: string;
};

export type PR = {
  id: string;
  pullReqNumber: number;
  title: string;
  description: string | null;
  state: string;
  branch: string;
  baseBranch: string;
  repoName: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  workspaceId: string;
  analysis: Analysis[];
};

type dashboardStore = {
  metrics: Metrics | null;
  prs: PR[];
  isDashboardLoading: boolean;
  fetchDashboard: ({ workspaceId }: { workspaceId: string }) => Promise<void>;
};

export const useDashboardStore = create<dashboardStore>((set) => ({
  isDashboardLoading: false,
  metrics: null,
  prs: [],
  fetchDashboard: async ({ workspaceId }: { workspaceId: string }) => {
    try {
      set({ isDashboardLoading: true });
      const res = await axiosInstance.get(
        `v1/dashboard/metrics/${workspaceId}`,
      );
      set({ metrics: res.data.metrics, prs: res.data.prs });
    } catch (error: unknown) {
      console.error("Error fetching repos", error);
      toast.error("Failed to fetch dashboard metrics!");
    } finally {
      set({ isDashboardLoading: false });
    }
  },
}));

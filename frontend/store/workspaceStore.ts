import { axiosInstance } from "@/utils/instance";
import toast from "react-hot-toast";
import { create } from "zustand";

export type Workspace = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  githubAppInstallation: {
    id: string;
    accountLogin: string;
    accountType: string;
  } | null;
};

type workspaceStore = {
  workspaces: Workspace[];
  isWorkspacesLoading: boolean;
  isCreatingWorkspace: boolean;
  fetchWorkspaces: () => Promise<void>;
  createWorkspace: (data: { workSpace_name: string; workSpace_Url: string }) => Promise<string | null>;
};

export const useWorkspaceStore = create<workspaceStore>((set) => ({
  workspaces: [],
  isWorkspacesLoading: false,
  isCreatingWorkspace: false,

  fetchWorkspaces: async () => {
    set({ isWorkspacesLoading: true });
    try {
      const res = await axiosInstance.get("v1/workspaces");
      set({ workspaces: res.data.workspaces });
    } catch (error) {
      console.error("Failed to fetch workspaces", error);
      toast.error("Failed to fetch workspaces");
    } finally {
      set({ isWorkspacesLoading: false });
    }
  },

  createWorkspace: async (data) => {
    set({ isCreatingWorkspace: true });
    try {
      const res = await axiosInstance.post("v1/onboarding/workspace-setup", data);
      toast.success("Workspace created effectively!");
      return res.data.redirectURL;
    } catch (error: any) {
      console.error("Failed to create workspace", error);
      toast.error(error.response?.data?.error || "Failed to create workspace");
      return null;
    } finally {
      set({ isCreatingWorkspace: false });
    }
  },
}));

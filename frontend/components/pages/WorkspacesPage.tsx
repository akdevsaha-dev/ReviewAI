"use client";

import { useWorkspaceStore } from "@/store/workspaceStore";
import { useEffect, useState } from "react";
import {
  Plus,
  Settings,
  GitBranch,
  ExternalLink,
  Layout,
  Loader,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";

export const WorkspacesPage = () => {
  const {
    workspaces,
    fetchWorkspaces,
    isWorkspacesLoading,
    createWorkspace,
    isCreatingWorkspace
  } = useWorkspaceStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const redirectUrl = await createWorkspace({
      workSpace_name: newName,
      workSpace_Url: newUrl
    });
    if (redirectUrl) {
      setShowCreateModal(false);
      setNewName("");
      setNewUrl("");
      fetchWorkspaces();
    }
  };

  return (
    <div className="min-h-screen w-full space-y-6 px-6 py-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Workspaces</h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">
            Manage your organizations and connected repositories.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800/30 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create Workspace
        </button>
      </div>

      {isWorkspacesLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 rounded-2xl bg-neutral-100 dark:bg-neutral-900/50 animate-pulse border dark:border-neutral-800 border-neutral-200" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {workspaces.map((ws) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                key={ws.id}
                className="group relative flex flex-col justify-between p-6 rounded-2xl border dark:border-neutral-800 border-neutral-200 dark:bg-[#0e0e10]/80 bg-white hover:border-[#5c4cd8]/30 transition-all duration-200 shadow-sm"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-500 group-hover:text-[#5c4cd8] transition-colors">
                      <Layout className="w-5 h-5" />
                    </div>
                    <Link
                      href={`/settings/${ws.name}/${ws.id}`}
                      className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                    </Link>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold tracking-tight truncate">
                      {ws.name}
                    </h3>
                    <p className="text-xs text-neutral-500 font-mono mt-1">
                      prwise.app/{ws.slug}
                    </p>
                  </div>

                  <div className="pt-2">
                    {ws.githubAppInstallation ? (
                      <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-bold tracking-wider bg-emerald-500/10 w-fit px-2 py-0.5 rounded border border-emerald-500/20">
                        <GitBranch className="w-3 h-3" />
                        CONNECTED: {ws.githubAppInstallation.accountLogin}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-neutral-400 text-[10px] font-bold tracking-wider bg-neutral-500/5 w-fit px-2 py-0.5 rounded border border-neutral-500/10">
                        <AlertCircle className="w-3 h-3" />
                        NO REPO CONNECTED
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8">
                  <Link
                    href={`/dashboard/${ws.name}/${ws.id}`}
                    className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300 text-neutral-600 hover:bg-[#5c4cd8] hover:text-white font-semibold text-xs transition-all tracking-wide"
                  >
                    VIEW DASHBOARD
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create Modal Overlay */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl p-8 border dark:border-neutral-800 border-neutral-200 shadow-xl"
            >
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">New Workspace</h2>
                  <p className="text-neutral-500 text-sm mt-1">Shared environment for your code analysis.</p>
                </div>

                <form onSubmit={handleCreate} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-neutral-500 ml-1">Workspace Name</label>
                    <input
                      required
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Engineering Team"
                      className="w-full px-4 py-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border dark:border-neutral-800 border-neutral-200 focus:outline-none focus:border-[#5c4cd8] transition-all text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-neutral-500 ml-1">Unique URL Slug</label>
                    <div className="flex rounded-lg overflow-hidden border dark:border-neutral-800 border-neutral-200">
                      <div className="bg-neutral-100 dark:bg-neutral-800 px-3 flex items-center text-neutral-500 text-xs font-mono">
                        prwise.app/
                      </div>
                      <input
                        required
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        placeholder="engineering-team"
                        className="w-full px-3 py-2.5 bg-neutral-50 dark:bg-neutral-950 focus:outline-none transition-all text-sm font-mono"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col gap-2">
                    <button
                      type="submit"
                      disabled={isCreatingWorkspace}
                      className="w-full py-2.5 rounded-lg bg-[#5c4cd8] hover:bg-[#4a3bbd] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
                    >
                      {isCreatingWorkspace ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        "Create Workspace"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="w-full py-2 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 font-medium text-xs transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

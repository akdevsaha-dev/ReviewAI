import type { Request, Response } from "express";

import { prisma } from "../lib/prisma.js";

export const workspaceSetup = async (req: Request, res: Response) => {
  const session = req.session;
  const { workSpace_name, workSpace_Url } = req.body;
  const normalizedName = String(workSpace_name ?? "").trim();
  const normalizedSlug = String(workSpace_Url ?? "").trim();

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (!normalizedName || !normalizedSlug) {
    return res.status(400).json({
      error: "Workspace name and workspace URL are required",
    });
  }

  try {
    const ownerId = session.user.id;
    const workspaceCount = await prisma.workspace.count({
      where: {
        ownerId,
      },
    });
    const existing = await prisma.workspace.findFirst({
      where: {
        ownerId,
        name: normalizedName,
      },
    });
    const existingSlug = await prisma.workspace.findUnique({
      where: {
        slug: normalizedSlug,
      },
    });

    if (existing) {
      return res.status(409).json({
        error: "Workspace with this name already exists",
      });
    }
    if (existingSlug) {
      return res.status(409).json({
        error: "Workspace URL is already taken",
      });
    }

    const workspace = await prisma.workspace.create({
      data: {
        name: normalizedName,
        slug: normalizedSlug,
        ownerId,
      },
    });

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3001";



    if (workspaceCount === 0) {
      return res.status(201).json({
        redirectURL: `${frontendUrl}/onboarding/github-install/${workspace.name}/${workspace.id}`,
      });
    } else {
      return res.status(201).json({
        redirectURL: `${frontendUrl}/dashboard/${workspace.name}/${workspace.id}`,
      });
    }
  } catch (error) {
    console.error("Error creating workspace", error);
    return res.status(500).json({
      error: "Failed to create workspace",
    });
  }
};

export const disconnectWorkspaceRepo = async (req: Request, res: Response) => {
  const session = req.session;
  const workspaceIdParam = req.params.workspaceId;

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (Array.isArray(workspaceIdParam)) {
    return res.status(400).json({
      error: "Multiple workspace IDs are not supported here.",
    });
  }

  if (!workspaceIdParam) {
    return res.status(400).json({ error: "Workspace Id is required" });
  }

  const workspaceId = workspaceIdParam;

  try {
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: { githubAppInstallation: true },
    });

    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    if (workspace.ownerId !== session.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    if (!workspace.githubAppInstallation) {
      return res.status(200).json({
        message: "No connected repository found for this workspace.",
      });
    }

    await prisma.githubAppInstallation.delete({
      where: { workspaceId },
    });

    return res.status(200).json({
      message: "Repository disconnected successfully.",
    });
  } catch (error) {
    console.error("Error disconnecting repository", error);
    return res.status(500).json({
      error: "Failed to disconnect repository",
    });
  }
};

export const deleteWorkspace = async (req: Request, res: Response) => {
  const session = req.session;
  const workspaceIdParam = req.params.workspaceId;

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (Array.isArray(workspaceIdParam)) {
    return res.status(400).json({
      error: "Multiple workspace IDs are not supported here.",
    });
  }

  if (!workspaceIdParam) {
    return res.status(400).json({ error: "Workspace Id is required" });
  }

  const workspaceId = workspaceIdParam;

  try {
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: { id: true, ownerId: true },
    });

    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    if (workspace.ownerId !== session.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await prisma.$transaction(async (tx) => {
      const pullRequests = await tx.pullRequest.findMany({
        where: { workspaceId },
        select: { id: true },
      });

      const pullRequestIds = pullRequests.map((pr) => pr.id);

      if (pullRequestIds.length > 0) {
        await tx.analysis.deleteMany({
          where: { pullRequestId: { in: pullRequestIds } },
        });
      }

      await tx.pullRequest.deleteMany({
        where: { workspaceId },
      });

      await tx.githubAppInstallation.deleteMany({
        where: { workspaceId },
      });

      await tx.workspace.delete({
        where: { id: workspaceId },
      });
    });

    return res.status(200).json({
      message: "Workspace deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting workspace", error);
    return res.status(500).json({
      error: "Failed to delete workspace",
    });
  }
};

export const getWorkspaces = async (req: Request, res: Response) => {
  const session = req.session;

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const ownerId = session.user.id;
    const workspaces = await prisma.workspace.findMany({
      where: {
        ownerId,
      },
      include: {
        githubAppInstallation: {
          select: {
            id: true,
            accountLogin: true,
            accountType: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({ workspaces });
  } catch (error) {
    console.error("Error fetching workspaces", error);
    return res.status(500).json({
      error: "Failed to fetch workspaces",
    });
  }
};

export const completeOnboarding = async (req: Request, res: Response) => {
  const session = req.session;

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const userId = session.user.id;
    await prisma.user.update({
      where: { id: userId },
      data: { firstLogin: false },
    });

    return res.status(200).json({ message: "Onboarding completed successfully" });
  } catch (error) {
    console.error("Error completing onboarding", error);
    return res.status(500).json({
      error: "Failed to complete onboarding",
    });
  }
};


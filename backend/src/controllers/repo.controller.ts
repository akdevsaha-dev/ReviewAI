import { Octokit } from "octokit";
import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { getInstallationAccessToken } from "../utils/accessToken.js";

export const getRepositories = async (req: Request, res: Response) => {
  try {
    const workspaceId = req.params.workspaceId as string;
    const session = req.session;

    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const installation = await prisma.githubAppInstallation.findUnique({
      where: {
        workspaceId,
      },
    });

    const installation_id = installation?.installationId;
    if (!installation_id) {
      return res
        .status(404)
        .json({ error: "No GitHub installation found for this workspace" });
    }

    const installation_idNum = parseInt(installation_id, 10);
    const accessToken = await getInstallationAccessToken(installation_idNum);
    const octokit = new Octokit({
      auth: accessToken,
    });

    const { data } = await octokit.request("GET /installation/repositories", {
      sort: "created",
      direction: "desc",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    const repos = data.repositories.map((repo) => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      private: repo.private,
      url: repo.html_url,
      language: repo.language,
      issueCount: repo.open_issues_count,
    }));

    return res.json({
      totalRepos: data.total_count,
      repos,
    });
  } catch (error) {
    console.error("Get repositories error:", error);
    return res.status(500).json({
      message: "Cannot get repositories",
    });
  }
};

export const repoStatus = async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.params;
    if (Array.isArray(workspaceId)) {
      return res.status(400).json({
        error: "Multiple workspace IDs are not supported here.",
      });
    }
    if (!workspaceId) {
      return res.status(400).json({
        error: "Workspace Id is required",
      });
    }
    const installation = await prisma.githubAppInstallation.findUnique({
      where: {
        workspaceId,
      },
    });
    const isConnected = !!installation;

    return res.json({
      connected: isConnected,
      installation: installation || null,
    });
  } catch (error) {
    console.error("Repo status error:", error);

    return res.status(500).json({
      error: "Failed to check repo connection",
    });
  }
};

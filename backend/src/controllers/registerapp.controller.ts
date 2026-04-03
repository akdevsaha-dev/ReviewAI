import type { Request, Response } from "express";
import { Octokit } from "octokit";
import { prisma } from "../lib/prisma.js";
import { generateSecret } from "../utils/generateSecret.js";

export const registerApp = async (req: Request, res: Response) => {
  try {
    const { installation_id, state } = req.query;
    const workspaceId = state;
    const session = req.session;

    if (!installation_id || !workspaceId) {
      return res.status(400).send("Missing or invalid query params");
    }

    if (!session) {
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3001";
      return res.redirect(`${frontendUrl}/signin`);
    }

    const existingInstallation = await prisma.githubAppInstallation.findUnique({
      where: { workspaceId: String(workspaceId) },
    });

    const jwtToken = generateSecret();
    const octokit = new Octokit({
      auth: jwtToken,
    });

    const installation_idNum = parseInt(installation_id as string, 10);
    if (isNaN(installation_idNum)) {
      return res.status(400).send("Invalid installation_id");
    }

    const { data } = await octokit.request(
      "GET /app/installations/{installation_id}",
      {
        installation_id: installation_idNum,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      },
    );

    if (!data.account) {
      return res.status(400).send("GitHub installation account data not found");
    }

    let accountLogin: string;
    let accountType: string;

    if ("login" in data.account) {
      accountLogin = data.account.login;
      accountType = "User";
    } else if ("name" in data.account) {
      accountLogin = data.account.name;
      accountType = "Enterprise";
    } else {
      throw new Error("Unknown account type from GitHub installation");
    }

    await prisma.githubAppInstallation.upsert({
      where: {
        workspaceId: String(workspaceId),
      },
      update: {
        installationId: installation_id.toString(),
        accountLogin,
        accountType,
      },
      create: {
        workspaceId: String(workspaceId),
        installationId: installation_id.toString(),
        accountLogin,
        accountType,
      },
    });

    const workspace = await prisma.workspace.findUnique({
      where: { id: String(workspaceId) },
      select: { name: true },
    });

    if (!workspace) {
      return res.status(404).send("Workspace not found");
    }

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3001";

    if (!existingInstallation) {
      return res.redirect(
        `${frontendUrl}/onboarding/success?workspaceName=${workspace.name}&workspaceId=${workspaceId}&connected=github`,
      );
    } else {
      return res.redirect(
        `${frontendUrl}/dashboard/${workspace.name}/${workspaceId}?connected=github`,
      );
    }
  } catch (error: any) {
    console.error("Register app error:", error);
    if (error.response) {
      console.error("GitHub API Error Response:", {
        status: error.response.status,
        data: error.response.data,
      });
      return res.status(error.response.status).json({
        message: "GitHub API Error",
        details: error.response.data,
      });
    }
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

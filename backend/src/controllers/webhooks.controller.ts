import type { Request, Response } from "express";
import { Octokit } from "octokit";
import { getInstallationAccessToken } from "../utils/accessToken.js";
import { prisma } from "../lib/prisma.js";
import { analyzeWithAi } from "../utils/aireview.js";
export const webhookEvent = async (req: Request, res: Response) => {
  try {
    const githubEvent = req.headers["x-github-event"];
    const payload = req.body;
    res.status(200).send("Webhook received");
    if (
      githubEvent === "pull_request" &&
      (payload.action === "opened" || payload.action === "synchronize")
    ) {
      const owner = payload.repository.owner.login;
      const repo = payload.repository.name;
      const pull_number = payload.pull_request.number;
      const title = payload.pull_request.title;
      const description = payload.pull_request.body;
      const state = payload.pull_request.state;
      const branch = payload.pull_request.head.ref;
      const baseBranch = payload.pull_request.base.ref;
      const sha = payload.pull_request.head.sha;
      const installation = await prisma.githubAppInstallation.findFirst({
        where: {
          accountLogin: owner,
        },
      });
      if (!installation) {
        console.log("No GitHub installation found for this repo");
        return;
      }

      const pullRequest = await prisma.pullRequest.upsert({
        where: {
          id: `${installation.workspaceId}-${pull_number}-${sha}`,
        },
        update: {
          title,
          description,
          state,
          branch,
          baseBranch,
          updatedAt: new Date(),
        },
        create: {
          id: `${installation.workspaceId}-${pull_number}-${sha}`,
          title,
          description,
          pullReqNumber: pull_number,
          state,
          branch,
          repoName: repo,
          baseBranch,
          workspaceId: installation.workspaceId,
        },
      });
      const installationIdNum = parseInt(installation.installationId, 10);
      const accessToken = await getInstallationAccessToken(installationIdNum);
      const octokit = new Octokit({ auth: accessToken });

      const checkRunResponse = await octokit.request(
        "POST /repos/{owner}/{repo}/check-runs",
        {
          owner,
          repo,
          name: "PRwise AI Review",
          head_sha: sha,
          status: "in_progress",
          started_at: new Date().toISOString(),
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
          },
        },
      );
      const checkRunId = checkRunResponse.data.id;

      const { data: files } = await octokit.request(
        "GET /repos/{owner}/{repo}/pulls/{pull_number}/files",
        { owner, repo, pull_number },
      );

      const MAX_DIFF_LENGTH = 12000;
      const diffs = files
        .filter((f) => f.patch)
        .map((f) => `File: ${f.filename}\n${f.patch}`)
        .join("\n\n")
        .slice(0, MAX_DIFF_LENGTH);
      let parsed;
      try {
        parsed = await analyzeWithAi(diffs);
      } catch {
        parsed = {
          comment: "AI analysis failed.",
          suggestions: "Please review this PR manually.",
          bugRiskScore: 0,
        };
      }

      const body = `
### PRwise AI Review

**Summary**
${parsed.comment}

**Suggestions**
${parsed.suggestions}
`;

      await octokit.request(
        "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
        {
          owner: owner,
          repo: repo,
          issue_number: pull_number,
          body,
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
          },
        },
      );

      await octokit.request(
        "PATCH /repos/{owner}/{repo}/check-runs/{check_run_id}",
        {
          owner,
          repo,
          check_run_id: checkRunId,
          status: "completed",
          completed_at: new Date().toISOString(),
          conclusion: "success",
          output: {
            title: "PRwise AI Review",
            summary: parsed.comment,
            text: `Suggestions:\n${parsed.suggestions}\n\nBug Risk Score: ${parsed.bugRiskScore}`,
          },
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
          },
        },
      );

      await prisma.analysis.create({
        data: {
          status: "Completed",
          summary: parsed.comment,
          suggestions: parsed.suggestions,
          bugRiskScore: parsed.bugRiskScore,
          pullRequestId: pullRequest.id,
        },
      });
    }
  } catch (error) {
    console.error(error);
  }
};

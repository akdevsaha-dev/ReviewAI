import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
export const getDashboardMetric = async (req: Request, res: Response) => {
  try {
    const workspaceId = req.params;

    const [totalPRs, openPRs, highRiskPRs, avgRisk, lastAnalysis, prs] =
      await Promise.all([
        await prisma.analysis.count({
          where: {
            pullRequest: {
              workspaceId,
            },
          },
        }),

        await prisma.pullRequest.count({
          where: {
            workspaceId,
            state: "open",
          },
        }),

        await prisma.analysis.count({
          where: {
            pullRequest: {
              workspaceId,
            },
            bugRiskScore: {
              gte: 7,
            },
          },
        }),

        await prisma.analysis.aggregate({
          where: {
            pullRequest: {
              workspaceId,
            },
          },
          _avg: {
            bugRiskScore: true,
          },
        }),

        await prisma.analysis.findFirst({
          where: {
            pullRequest: {
              workspaceId,
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        }),

        await prisma.pullRequest.findMany({
          where: {
            workspaceId,
          },
          orderBy: {
            createdAt: "desc",
          },
          include: {
            analysis: {
              take: 1,
              orderBy: {
                createdAt: "desc",
              },
            },
          },
        }),
      ]);

    return res.status(200).json({
      metrics: {
        totalPRs,
        openPRs,
        highRiskPRs,
        avgRiskScore: avgRisk._avg.bugRiskScore,
        lastAnalysis,
      },
      prs,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

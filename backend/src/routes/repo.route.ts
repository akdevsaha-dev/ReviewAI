import express, { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getRepositories, repoStatus } from "../controllers/repo.controller.js";

const router: Router = express.Router();

router.get("/repositories/:workspaceId", authMiddleware, getRepositories);
router.get("/workspace/:workspaceId/repo-status", authMiddleware, repoStatus);
export default router;

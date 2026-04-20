import express, { Router } from "express";
import {
  deleteWorkspace,
  disconnectWorkspaceRepo,
  getWorkspaces,
  workspaceSetup,
  completeOnboarding,
} from "../controllers/workspace.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";

const router: Router = express.Router();
router.get("/workspaces", authMiddleware, getWorkspaces);
router.post("/onboarding/workspace-setup", authMiddleware, workspaceSetup);
router.post("/onboarding/complete", authMiddleware, completeOnboarding);

router.delete(
  "/workspace/:workspaceId/repo-connection",
  authMiddleware,
  disconnectWorkspaceRepo,
);
router.delete("/workspace/:workspaceId", authMiddleware, deleteWorkspace);

export default router;

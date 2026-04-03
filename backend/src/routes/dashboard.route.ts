import express, { Router } from "express";
import { getDashboardMetric } from "../controllers/dashboard.controller.js";

const router: Router = express.Router();

router.get("/dashboard/metrics/:workspaceId", getDashboardMetric);

export default router;

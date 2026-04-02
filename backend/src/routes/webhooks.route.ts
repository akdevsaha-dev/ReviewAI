import express, { Router } from "express";
import { webhookEvent } from "../controllers/webhooks.controller.js";

const router: Router = express.Router();

router.post("/webhook", webhookEvent);
export default router;

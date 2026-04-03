import "dotenv/config";
import express from "express";
import ngrok from "@ngrok/ngrok";
import cors from "cors";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import { auth } from "./utils/auth.js";
import workspaceRoute from "./routes/workspace.route.js";
import registerappRoute from "./routes/registerApp.route.js";
import repoRoute from "./routes/repo.route.js";
import webhookRoute from "./routes/webhooks.route.js";

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    credentials: true,
  }),
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/api/v1", workspaceRoute, repoRoute);
app.use("/api/github", registerappRoute, webhookRoute);

app.get("/api/me", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  return res.json(session);
});

app.listen(port, async () => {
  console.log(`Server running on http://localhost:${port}`);

  try {
    const listener = await ngrok.connect({
      addr: port,
      authtoken: process.env.NGROK_AUTHTOKEN,
      domain: "ghoul-ready-moccasin.ngrok-free.app",
    });

    console.log(`Ingress established at: ${listener.url()}`);
  } catch (err) {
    console.error("Ngrok failed:", err);
  }
});

import jwt from "jsonwebtoken";
import fs from "fs";
export const generateSecret = () => {
  const privateKeyPath = process.env.GITHUB_APP_PRIVATE_KEY_PATH;
  if (!privateKeyPath) {
    throw new Error(
      "GITHUB_APP_PRIVATE_KEY_PATH is not defined in environment variables",
    );
  }
  const privateKey = fs.readFileSync(privateKeyPath, "utf8");
  const now = Math.floor(Date.now() / 1000);

  return jwt.sign(
    {
      iat: now - 60,
      exp: now + 60 * 9,
      iss: Number(process.env.GITHUB_APP_ID),
    },
    privateKey,
    {
      algorithm: "RS256",
    },
  );
};

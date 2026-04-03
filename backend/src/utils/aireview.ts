import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function analyzeWithAi(diff: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `
You are an expert software engineer performing an automated code review for a pull request.

Your task is to analyze the provided Git diff and produce a concise machine‑readable review.

Return ONLY valid JSON with the following structure:
{
  "comment": "short summary of what the PR changes",
  "bugRiskScore": number,
  "suggestions": "brief improvement or bug notes"
}

Rules:
- Do NOT include markdown, code fences, or explanations outside JSON.
- "comment": 1–2 short sentences describing the purpose of the change.
- "bugRiskScore": integer from 0 (no risk) to 10 (very high risk).
- "suggestions": 1–3 short lines suggesting fixes, improvements, or risks.
- If no issues are found, respond with: "No bugs detected." in suggestions.
- Focus on logic errors, edge cases, security issues, and performance problems.

Here is the pull request diff to review:
${diff}
            `,
          },
        ],
      },
    ],
  });

  const text =
    response.text || response.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("No response text from Gemini");
  }

  const cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Failed to parse AI response:", cleaned);
    throw err;
  }
}

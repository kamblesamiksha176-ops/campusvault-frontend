import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Parse request body
app.use(express.json());

// Lazy-initialize Gemini AI Client to prevent crash on startup if key is missing
let aiClient: any = null;
function getAiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing. Please set it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// REST APIs for Vault AI Module
app.post("/api/ai/action", async (req: express.Request, res: express.Response): Promise<void> => {
  const { actionType, prompt, extraParams } = req.body;

  if (!actionType) {
    res.status(400).json({ error: "actionType is required" });
    return;
  }

  try {
    const ai = getAiClient();

    let systemInstruction = "You are Vault AI, an advanced virtual engineering tutor and study assistant for Diploma and Engineering students. You provide concise, academically rich, clear, and highly professional answers. You are knowledgeable in Engineering Mathematics, Computer Engineering, Electrical Engineering, Mechanical Engineering, Civil Engineering, and Electronics.";
    let contents = prompt;

    if (actionType === "chat") {
      systemInstruction += " Answer the student's questions regarding their studies, coding, or projects. Provide real-world engineering context where possible. Keep code snippets clean and formatted in Markdown.";
    } else if (actionType === "explain") {
      systemInstruction += " Break down the requested complex engineering concept into structured parts: (1) Standard Definition, (2) Core Analogy for simple understanding, (3) Key Technical Formula/Parameters, and (4) Real-world Application. Keep explanations clear and robust.";
      contents = `Explain this engineering topic in depth: "${prompt}"`;
    } else if (actionType === "roadmap") {
      systemInstruction += " Generate a structured career path or technical learning roadmap. Provide step-by-step phases, required skill sets, and recommended project ideas.";
      contents = `Generate a comprehensive professional roadmap for: "${prompt}"`;
    } else if (actionType === "summarize") {
      systemInstruction += " Summarize the provided engineering study notes or textbook topic. Structure it into: (1) High-level Overview, (2) Core Bullet Points of main takeaways, (3) Key Formulas/Keywords list.";
      contents = `Summarize these notes or topic: "${prompt}"`;
    } else {
      res.status(400).json({ error: "Invalid actionType" });
      return;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ 
      error: error.message || "An error occurred while generating content with Vault AI." 
    });
  }
});

// Endpoint for generating structured quizzes
app.post("/api/ai/generate-quiz", async (req: express.Request, res: express.Response): Promise<void> => {
  const { subject, branch, semester } = req.body;

  if (!subject) {
    res.status(400).json({ error: "subject is required" });
    return;
  }

  try {
    const ai = getAiClient();

    const systemInstruction = `You are an expert engineering college professor. Your job is to create a high-quality 3-question multiple choice quiz for Diploma/Engineering students based on the provided subject, branch, and semester.
    Return the response strictly adhering to the specified JSON schema. Ensure questions are challenging, technically accurate, and provide educational explanations.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Create a 3-question quiz for Subject: "${subject}", Branch: "${branch || 'All Branches'}", Semester: "${semester || 'All Semesters'}".`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Title of the quiz" },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  questionText: { type: Type.STRING, description: "The quiz question" },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Exactly four multiple choice options"
                  },
                  correctAnswerIndex: { type: Type.INTEGER, description: "0-based index of the correct answer (0, 1, 2, or 3)" },
                  explanation: { type: Type.STRING, description: "A detailed explanation of why the selected answer is correct" }
                },
                required: ["questionText", "options", "correctAnswerIndex", "explanation"]
              }
            }
          },
          required: ["title", "questions"]
        }
      }
    });

    const quizData = JSON.parse(response.text.trim());
    res.json(quizData);
  } catch (error: any) {
    console.error("Gemini Quiz Generation Error:", error);
    res.status(500).json({ 
      error: error.message || "An error occurred while generating the quiz." 
    });
  }
});

// Setup Vite Dev Server / Static Asset Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite middleware mounted in development mode.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static production assets from dist/.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CampusVault Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});

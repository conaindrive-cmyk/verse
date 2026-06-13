/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Express JSON parsing middleware with custom limits
app.use(express.json({ limit: "10mb" }));

// In-memory news post storage to enable adding/previewing new posts dynamically on the server
let serverSideArticles: any[] = [];

// Initialize Gemini SDK with telemetry header requested in SKILL.md
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// REST API Endpoints
app.get("/images/capture.png", (req, res) => {
  res.sendFile(path.join(process.cwd(), "Capture.PNG"));
});

app.get("/images/gallery-1.jpeg", (req, res) => {
  res.sendFile(path.join(process.cwd(), "WhatsApp Image 2026-06-07 at 6.33.14 PM (1).jpeg"));
});

app.get("/images/gallery-2.jpeg", (req, res) => {
  res.sendFile(path.join(process.cwd(), "WhatsApp Image 2026-06-07 at 7.07.50 PM (1).jpeg"));
});

app.get("/api/news", (req, res) => {
  res.json({
    articles: serverSideArticles,
    hasApiKey: !!apiKey,
  });
});

app.post("/api/news", (req, res) => {
  const newArticle = {
    ...req.body,
    id: `article-${Date.now()}`,
    viewCount: Math.floor(Math.random() * 500) + 10,
    publishedAt: new Date().toISOString(),
  };
  serverSideArticles.unshift(newArticle);
  res.status(201).json(newArticle);
});

app.delete("/api/news/:id", (req, res) => {
  const { id } = req.params;
  serverSideArticles = serverSideArticles.filter((a) => a.id !== id);
  res.json({ success: true, message: `Article with ID ${id} deleted.` });
});

// AI Writing endpoint utilizing generative AI models
app.post("/api/news/generate", async (req, res) => {
  const { topic, category, instructions } = req.body;

  if (!topic) {
    return res.status(400).json({ error: "A topic or prompt is required for the News Verse AI generator." });
  }

  if (!ai) {
    // Elegant fallbacks when GEMINI_API_KEY is not configured yet
    return res.json({
      fallback: true,
      article: {
        title: `Exclusive Report: The Shift in Global ${category || "Technology"} Paradigm`,
        summary: `Our on-ground editorial team analyzes how ${topic} is driving critical systemic changes across international networks.`,
        content: `### The Deep-Dive Analysis on ${topic}\n\nOur correspondents in London, Islamabad, and Clifton-Karachi have observed a major visual and operational shift regarding this topic. As public interest accelerates, leading institutions are committing green grants and operational resources to address key concerns.\n\n"The infrastructure demands a holistic pivot," says an industry spokesperson. "We cannot rely on legacy frameworks when the future demands high-tempo retro fusions and digital harbor integrations."\n\n### Entertainment or Engineering?\n\nWhether centered around digital innovations or Lollywood's expanding red carpet presence, early statistics verify that consumer adoption is scaling exponentially. We will continue tracking live metrics to provide truth beyond standard headlines.\n\n*(Note: This is an automatically generated server fallback article because the GEMINI_API_KEY is not setup in the Secrets panel yet. To activate deep AI generation, configure the key in Settings.)*`,
        category: category || "Technology",
        readTime: "3 min read",
        author: "AI Newsroom Assistant",
        imageUrlKeyword: "news",
      },
    });
  }

  try {
    // Call the recommended modeling tool 'gemini-3.5-flash'
    const prompt = `Write a high-quality, professional, and journalistic news article about "${topic}". 
Category should be matching: "${category || "Latest News"}".
Additional requirements: ${instructions || "Maintain BBC-grade factual tone and neutral presentation."}

Generate structured outputs conforming exactly to the response schema. Keep the content realistic and detailed (minimum 3 long paragraphs with subheadings markdown format like "### Subheading Name").`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are the premium Editor-in-Chief of News Verse, an elite global news outlet inspired by BBC News. Your articles are objective, authoritative, sophisticated, and feature clean typography structure. Place subheadings in the content text (formatted as ### Subheading) to break up the flow.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "Extremely engaging, professional, and credible headline.",
            },
            summary: {
              type: Type.STRING,
              description: "A single, professional, high-impact summary paragraph.",
            },
            content: {
              type: Type.STRING,
              description: "Complete full article body, containing realistic, detailed paragraphs and subheadings formatted with ###.",
            },
            category: {
              type: Type.STRING,
              description: "The primary category (Home, Latest News, Entertainment, Pakistan, World, Business, Technology, Sports).",
            },
            readTime: {
              type: Type.STRING,
              description: "Read duration Estimator, e.g. '4 min read'.",
            },
            author: {
              type: Type.STRING,
              description: "Author's name and title, e.g. 'Jane Doe, Tech Editor'.",
            },
            imageUrlKeyword: {
              type: Type.STRING,
              description: "A single search term/keyword (e.g., 'concert', 'quantum', 'fashion') to locate a great graphic cover image.",
            },
          },
          required: ["title", "summary", "content", "category", "readTime", "author", "imageUrlKeyword"],
        },
      },
    });

    const parsedData = JSON.parse(response.text?.trim() || "{}");
    res.json({ success: true, article: parsedData });
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    res.status(500).json({ error: error?.message || "Internal server error occurred while invoking Gemini API. Please verify the Gemini secret token." });
  }
});

// Configure Vite middleware or Static serving depending on current build mode
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Serve with Vite dev server
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware integrated.");
  } else {
    // Serve static files in production mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static bundle in production mode.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`News Verse full-stack server running on http://localhost:${PORT}`);
  });
}

startServer();

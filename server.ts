import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini API Client
  const apiKey = process.env.GEMINI_API_KEY || "";
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  } else {
    console.warn("⚠️ GEMINI_API_KEY environment variable is not defined. Username generation will be unavailable.");
  }

  // API Route - generate usernames
  app.post("/api/generate", async (req, res) => {
    try {
      const { name, birthMonth, zodiac, interests, personality, stylePreference } = req.body;

      if (!ai) {
        return res.status(503).json({
          error: "Gemini API is not configured. Please set your GEMINI_API_KEY in the Settings > Secrets panel of your AI Studio Workspace."
        });
      }

      // Design prompt tailored to inputs
      const prompt = `Generate 15 highly creative, gorgeous, brandable, premium, and sophisticated usernames based on these user signals:
- Name (User's real or preferred name base): ${name || "Not provided"}
- Birth Month: ${birthMonth || "Not provided"}
- Zodiac Sign: ${zodiac || "Not provided"}
- Interests/Themes (e.g. tech, coding, design, gaming, anime): ${Array.isArray(interests) && interests.length > 0 ? interests.join(", ") : "General / Lifestyle"}
- Personality traits: ${Array.isArray(personality) && personality.length > 0 ? personality.join(", ") : "Balanced"}
- Style Preference: ${stylePreference || "Clean"}

Style-specific Guidelines:
1. "Clean": Modern, stylish, easy-to-read, standard capitalization, highly visual. (e.g. ZenKairo, NovaArin, FluxDev, SolAero)
2. "Aesthetic": Soft, ethereal, or cosmic feel, blending celestial, floral, or abstract concepts with high-contrast letters. (e.g. Velveteen, LunarVibe, Etheris, Solstice)
3. "Professional": Premium, resume-ready, brandable as a personal freelancer or SaaS identity. (e.g. KairoConsulting, ArinDigital, DevSymposium, ApexForge)
4. "Minimal": Ultra-short (4-8 chars if possible), extremely sleek, clean stems, no numbers or underscores. (e.g. Vex, Kyn, Zyl, Nyx, Elix)
5. "Unique": Exotic, blending rare roots (Latin, Greek, Norse), mythological keywords, or sleek tech compound words. (e.g. Asterion, ChronosTech, Valkyria, Cyberium)

Absolute Rules:
- The username must be between 3 and 15 characters (shorter is highly preferred).
- Easy to read and pronounce. No random letters like "qwrtyz".
- Strictly avoid overused or generic online patterns: no "xX_", "123", "__", excessive underscores, or cringe numbers.
- Ensure the name feels natural, brandable, and completely polished.
- Do not return names that are common cliché spam. Every handle should look like a curated pseudonym or brand.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an elite naming strategist, global brand director, and linguistic designer who crafts gorgeous, memorable, and premium handles, usernames, and brand identities for creators, developers, and professionals. You design handles that people are proud to own and completely avoid low-quality or randomized clichés.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                username: {
                  type: Type.STRING,
                  description: "The created username. Must be under 15 characters and strictly standard alphanumeric (can use single capital letter pattern or underscores if stylistically chosen)."
                },
                meaning: {
                  type: Type.STRING,
                  description: "The semantic or linguistic synergy of the words/roots used. Explain what makes it high quality."
                },
                style: {
                  type: Type.STRING,
                  description: "The style categorization corresponding to the prompt inputs (e.g., Clean Minimalist, Cyber-Aesthetic, Classic Professional)."
                },
                suitability: {
                  type: Type.STRING,
                  description: "A short, engaging pitch explaining why this handle is perfect for them (e.g., 'Ideal for GitHub developer portfolios or clean tech Twitter handles')."
                }
              },
              required: ["username", "meaning", "style", "suitability"]
            }
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("No response returned from the naming model.");
      }

      const usernames = JSON.parse(responseText.trim());
      res.json({ success: true, data: usernames });
    } catch (error: any) {
      console.error("Username generation error:", error);
      res.status(500).json({ error: error.message || "An unexpected error occurred during username generation." });
    }
  });

  // API Route - check username availability across platforms in parallel
  app.post("/api/check-availability", async (req, res) => {
    try {
      const { username } = req.body;
      if (!username || typeof username !== "string") {
        return res.status(400).json({ error: "Missing or invalid username parameter" });
      }

      const cleanUsername = username.replace(/[^a-zA-Z0-9_\-]/g, "");
      const results: Record<string, { available: boolean; url: string; confirmed: boolean }> = {};

      const checkGitHub = async () => {
        try {
          const resp = await fetch(`https://api.github.com/users/${cleanUsername}`, {
            headers: { "User-Agent": "aistudio-build-namecraft" }
          });
          results.github = {
            available: resp.status === 404,
            url: `https://github.com/${cleanUsername}`,
            confirmed: resp.status === 200 || resp.status === 404
          };
        } catch (err) {
          results.github = { available: true, url: `https://github.com/${cleanUsername}`, confirmed: false };
        }
      };

      const checkDevto = async () => {
        try {
          const resp = await fetch(`https://dev.to/api/users/by_username?username=${cleanUsername}`, {
            headers: { "User-Agent": "aistudio-build-namecraft" }
          });
          results.devto = {
            available: resp.status === 404,
            url: `https://dev.to/${cleanUsername}`,
            confirmed: resp.status === 200 || resp.status === 404
          };
        } catch (err) {
          results.devto = { available: true, url: `https://dev.to/${cleanUsername}`, confirmed: false };
        }
      };

      const checkReddit = async () => {
        try {
          // Probe public Reddit about page
          const resp = await fetch(`https://www.reddit.com/user/${cleanUsername}/about.json`, {
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 NameCraft/1.0" }
          });
          results.reddit = {
            available: resp.status === 404 || resp.status === 403,
            url: `https://reddit.com/user/${cleanUsername}`,
            confirmed: resp.status === 200 || resp.status === 404
          };
        } catch (err) {
          results.reddit = { available: true, url: `https://reddit.com/user/${cleanUsername}`, confirmed: false };
        }
      };

      const checkTwitch = async () => {
        // Form link for direct user inspection, with a lightweight head request check to their public endpoint
        try {
          const resp = await fetch(`https://passport.twitch.tv/usernames/${cleanUsername}`, {
            method: "HEAD",
            headers: { "User-Agent": "Mozilla/5.0" }
          });
          results.twitch = {
            available: resp.status === 204 || resp.status === 404,
            url: `https://twitch.tv/${cleanUsername}`,
            confirmed: resp.status !== 500
          };
        } catch (err) {
          results.twitch = { available: true, url: `https://twitch.tv/${cleanUsername}`, confirmed: false };
        }
      };

      // Run parallel checks
      await Promise.all([checkGitHub(), checkDevto(), checkReddit(), checkTwitch()]);

      res.json({ success: true, results });
    } catch (error: any) {
      console.error("Availability API error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Serve Frontend Assets
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[NameCraft Server] Running at host 0.0.0.0 on port ${PORT}`);
  });
}

startServer();

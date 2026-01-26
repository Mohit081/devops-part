import "dotenv/config";
import path from "path";
import express from "express";
import { client } from "@repo/db/client";
import dotenv from "dotenv";

// Load root .env so Prisma can read DATABASE_URL at runtime
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hi there");
});

app.post("/signup", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    const user = await client.user.create({
      
      data: {
        username: username,
        password: password,
      },
    });

    res.json({
      message: "Signup successful",
      id: user.id,
    });
  } catch (err) {
    console.error("Signup failed:", err);
    res.status(500).json({ error: "Signup failed" });
  }
});

// Generic error handler to avoid abrupt connection resets
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = 3002;

(async () => {
  try {
    if (!process.env.DATABASE_URL) {
      console.error("DATABASE_URL is not set. Ensure .env is loaded.");
      process.exit(1);
    }
    await client.$connect();
    app.listen(PORT, () => {
      console.log(`HTTP server listening on ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
})();
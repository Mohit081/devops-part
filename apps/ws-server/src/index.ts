import "dotenv/config";
import dotenv from "dotenv";
import path from "path";
import { WebSocketServer } from "ws";
import { client } from "@repo/db/client";

// Load env from repo root so Prisma gets DATABASE_URL
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

async function main() {
  try {
    await client.$connect();
  } catch (err) {
    console.error("Prisma failed to connect:", err);
    process.exit(1);
  }

  const port = Number(process.env.WS_PORT ?? process.env.PORT ?? 3001);
  const server = new WebSocketServer({ port });

  server.on("connection", async (socket) => {
    try {
      await client.user.create({
        data: {
          username: Math.random().toString(),
          password: Math.random().toString(),
        },
      });
      socket.send("Hi there you are connected to the server");
    } catch (err) {
      console.error("Signup over WS failed:", err);
      socket.send("Error: signup failed");
    }
  });

  server.on("error", (err) => {
    console.error("WebSocket server error:", err);
  });

  console.log(`WS server listening on ${port}`);
}

main().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});

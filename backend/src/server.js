import { createServer } from "node:http";
import mongoose from "mongoose";
import { createApp } from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { initializeSocket, } from "./socket/socket.js";

let httpServer = null;
let socketServer = null;
let isShuttingDown = false;

/** * Database، Express و Socket.IO را اجرا می‌کند. */

export async function startServer() {
    await connectDB();

    const app = createApp();

    httpServer = createServer(app);

    socketServer = initializeSocket(httpServer);
    httpServer.listen(env.port, () => {
        console.log(`Server running in ${env.nodeEnv} mode on port ${env.port}`);

        console.log(`Socket.IO is ready on port ${env.port}`);
    });
    return { app, httpServer, socketServer, };
}

/** * سرور و MongoDB را به‌شکل امن می‌بندد. */

export async function shutdownServer(signal) {
    if (isShuttingDown) { return; } isShuttingDown = true;

    console.log(`${signal} received. Shutting down server...`);
    try {
        if (socketServer) {
            await new Promise((resolve) => {
                socketServer.close(resolve);

            });
        } else if (httpServer) {
            await new Promise((resolve, reject) => {
                httpServer.close((error) => { if (error) { reject(error); return; } resolve(); });
            });
        } await mongoose.connection.close(); console.log("Server and MongoDB connection closed."); process.exit(0);
    } catch (error) { console.error("Graceful shutdown failed:", error.message); process.exit(1); }
}
process.once("SIGINT", () => {
    void shutdownServer("SIGINT");
});

process.once("SIGTERM", () => {
    void shutdownServer("SIGTERM");
});

try {
    await startServer();
} catch (error) {
    console.error("Server startup failed:", error.message); process.exit(1);
}
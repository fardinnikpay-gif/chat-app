

import mongoose from "mongoose";

import { env } from "./env.js";

/**
 * برنامه را به MongoDB متصل می‌کند.
 */
export async function connectDB() {
    try {
        const connection = await mongoose.connect(env.mongodbUri);

        console.log(
            `MongoDB connected: ${connection.connection.host}/${connection.connection.name}`
        );

        return connection;
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);

        throw error;
    }
}
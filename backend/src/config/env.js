import dotenv from "dotenv";

export function loadEnv() {
    const result = dotenv.config();

    if (result.error) {
        throw new Error("The .env file could not be loaded.");
    }
}

export function validateEnv() {
    const requiredVariables = [
        "MONGODB_URI",
        "JWT_SECRET",
        "CLIENT_URL",
    ];

    const missingVariables = requiredVariables.filter(
        (variableName) => !process.env[variableName]
    );

    if (missingVariables.length > 0) {
        throw new Error(
            `Missing environment variables: ${missingVariables.join(", ")}`
        );
    }
}

loadEnv();
validateEnv();

export const env = Object.freeze({
    port: Number(process.env.PORT) || 5000,
    nodeEnv: process.env.NODE_ENV || "development",

    mongodbUri: process.env.MONGODB_URI,

    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
    jwtCookieExpiresDays:
        Number(process.env.JWT_COOKIE_EXPIRES_DAYS) || 7,

    clientUrl: process.env.CLIENT_URL,
});
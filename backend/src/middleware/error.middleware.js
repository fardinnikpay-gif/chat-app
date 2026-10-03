import { env } from "../config/env.js";
import { ApiError } from "../utils/apiError.js";

/**
 * Routeهای ناموجود را مدیریت می‌کند.
 */
export function notFound(req, res, next) {
    next(
        new ApiError(
            404,
            `Route not found: ${req.method} ${req.originalUrl}`
        )
    );
}

/**
 * تمام خطاهای برنامه را مدیریت می‌کند.
 */
export function errorHandler(error, req, res, next) {
    let statusCode = error.statusCode || 500;
    let message = error.message || "Internal server error.";
    let details = error.details || null;

    if (error.code === 11000) {
        statusCode = 409;

        const duplicateField =
            Object.keys(error.keyValue || {})[0] || "field";

        message = `${duplicateField} already exists.`;
    }

    if (error.name === "ValidationError") {
        statusCode = 400;
        message = "Database validation failed.";

        details = Object.values(error.errors).map(
            (validationError) => validationError.message
        );
    }

    if (error.name === "CastError") {
        statusCode = 400;
        message = `Invalid ${error.path}.`;
    }

    if (env.nodeEnv === "development") {
        console.error(error);
    }

    return res.status(statusCode).json({
        success: false,
        message,
        details,
        stack:
            env.nodeEnv === "development"
                ? error.stack
                : undefined,
    });
}
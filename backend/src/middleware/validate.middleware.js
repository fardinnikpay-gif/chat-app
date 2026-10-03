import mongoose from "mongoose";

import { ApiError } from "../utils/apiError.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * فرمت ایمیل را بررسی می‌کند.
 */
export function validateEmail(email) {
    return emailPattern.test(email);
}

/**
 * اطلاعات ثبت‌نام را بررسی می‌کند.
 */
export function validateRegister(req, res, next) {
    const { fullName, email, password } = req.body;

    const errors = [];

    if (!fullName || typeof fullName !== "string") {
        errors.push("Full name is required.");
    } else {
        const normalizedFullName = fullName.trim();

        if (normalizedFullName.length < 2) {
            errors.push(
                "Full name must be at least 2 characters."
            );
        }

        if (normalizedFullName.length > 50) {
            errors.push(
                "Full name cannot exceed 50 characters."
            );
        }
    }

    if (!email || typeof email !== "string") {
        errors.push("Email is required.");
    } else if (!validateEmail(email.trim())) {
        errors.push("Email format is invalid.");
    }

    if (!password || typeof password !== "string") {
        errors.push("Password is required.");
    } else if (password.length < 8) {
        errors.push(
            "Password must be at least 8 characters."
        );
    }

    if (errors.length > 0) {
        return next(
            new ApiError(
                400,
                "Registration validation failed.",
                errors
            )
        );
    }

    req.body.fullName = fullName.trim();
    req.body.email = email.trim().toLowerCase();

    next();
}

/**
 * اطلاعات ورود را بررسی می‌کند.
 */
export function validateLogin(req, res, next) {
    const { email, password } = req.body;

    const errors = [];

    if (!email || typeof email !== "string") {
        errors.push("Email is required.");
    } else if (!validateEmail(email.trim())) {
        errors.push("Email format is invalid.");
    }

    if (!password || typeof password !== "string") {
        errors.push("Password is required.");
    }

    if (errors.length > 0) {
        return next(
            new ApiError(
                400,
                "Login validation failed.",
                errors
            )
        );
    }

    req.body.email = email.trim().toLowerCase();

    next();
}

/**
 * معتبر بودن شناسه کاربر داخل URL را بررسی می‌کند.
 */
export function validateUserIdParam(req, res, next) {
    const { userId } = req.params;

    if (!mongoose.isValidObjectId(userId)) {
        return next(
            new ApiError(
                400,
                "User ID format is invalid."
            )
        );
    }

    next();
}

/**
 * متن پیام را اعتبارسنجی و پاک‌سازی می‌کند.
 */
export function validateMessage(req, res, next) {
    const { text } = req.body;

    if (typeof text !== "string") {
        return next(
            new ApiError(
                400,
                "Message text is required."
            )
        );
    }

    const normalizedText = text.trim();

    if (!normalizedText) {
        return next(
            new ApiError(
                400,
                "Message cannot be empty."
            )
        );
    }

    if (normalizedText.length > 2000) {
        return next(
            new ApiError(
                400,
                "Message cannot exceed 2000 characters."
            )
        );
    }

    req.body.text = normalizedText;

    next();
}


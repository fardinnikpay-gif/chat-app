import jwt from "jsonwebtoken";
import { env } from "../config/env.js";


export function generateToken(userId) {
    return jwt.sign({
        userId: userId.toString(),
    },
        env.jwtSecret,
        {
            expiresIn: env.jwtExpiresIn,
        }
    )
}

export function setTokenCookie(res, token) {
    const cookieMaxAge =
        env.jwtCookieExpiresDays * 24 * 60 * 60 * 1000;

    res.cookie("chat_token", token, {
        httpOnly: true,
        secure: env.nodeEnv === "production",
        sameSite: env.nodeEnv === "production" ? "none" : "lax",
        maxAge: cookieMaxAge,
        path: "/",
    });
}
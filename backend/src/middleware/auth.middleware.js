import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export function getRequestToken(req){
    if(req.cookies?.chat_token){
        return req.cookies.chat_token
    }

    const authorizationHeader = req.headers.authorization;

    if (
        authorizationHeader &&
        authorizationHeader.startsWith("Bearer ")
    ) {
        return authorizationHeader.split(" ")[1];
    }

    return null;
}



export const protectRoute = asyncHandler(async (req, res, next) => {
    const token = getRequestToken(req);

    if (!token) {
        throw new ApiError(
            401,
            "Authentication required. Please log in."
        );
    }

    let decodedToken;

    try {
        decodedToken = jwt.verify(token, env.jwtSecret);
    } catch (error) {
        throw new ApiError(
            401,
            "Your authentication token is invalid or expired."
        );
    }

    const user = await User.findById(decodedToken.userId);

    if (!user) {
        throw new ApiError(
            401,
            "The user belonging to this token no longer exists."
        );
    }

    req.user = user;

    next();
});
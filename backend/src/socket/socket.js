import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { parse as parseCookie } from "cookie";

import { env } from "../config/env.js";
import { User } from "../models/User.js";

/*
 * نمونه ساختار:
 *
 * Map {
 *   "USER_ID" => Set {
 *       "SOCKET_ID_ONE",
 *       "SOCKET_ID_TWO"
 *   }
 * }
 *
 * استفاده از Set باعث می‌شود یک کاربر بتواند
 * هم‌زمان در چند تب یا دستگاه متصل باشد.
 */
const connectedUsers = new Map();

let ioInstance = null;

/**
 * Bearer را از ابتدای Token حذف می‌کند.
 */
export function normalizeToken(tokenValue) {
    if (
        !tokenValue ||
        typeof tokenValue !== "string"
    ) {
        return null;
    }

    const trimmedToken = tokenValue.trim();

    if (trimmedToken.startsWith("Bearer ")) {
        return trimmedToken.slice(7).trim();
    }

    return trimmedToken;
}

/**
 * Token را از auth یا Cookie اتصال Socket دریافت می‌کند.
 */
export function getSocketToken(socket) {
    const authenticationToken =
        socket.handshake.auth?.token;

    if (authenticationToken) {
        return normalizeToken(authenticationToken);
    }

    const cookieHeader =
        socket.handshake.headers.cookie;

    if (!cookieHeader) {
        return null;
    }

    const cookies = parseCookie(cookieHeader);

    return normalizeToken(cookies.chat_token);
}

/**
 * پیش از برقراری اتصال، کاربر را احراز هویت می‌کند.
 */
export async function authenticateSocket(
    socket,
    next
) {
    try {
        const token = getSocketToken(socket);

        if (!token) {
            return next(
                new Error(
                    "Authentication required."
                )
            );
        }

        const decodedToken = jwt.verify(
            token,
            env.jwtSecret
        );

        const user = await User.findById(
            decodedToken.userId
        )
            .select("_id fullName email")
            .lean();

        if (!user) {
            return next(
                new Error(
                    "The authenticated user no longer exists."
                )
            );
        }

        socket.data.user = user;
        socket.data.userId =
            user._id.toString();

        next();
    } catch (error) {
        next(
            new Error(
                "Authentication token is invalid or expired."
            )
        );
    }
}

/**
 * نام Room خصوصی یک کاربر را می‌سازد.
 */
export function getUserRoom(userId) {
    return `user:${userId.toString()}`;
}

/**
 * اتصال جدید کاربر را ذخیره می‌کند.
 */
export function addUserSocket(
    userId,
    socketId
) {
    const normalizedUserId =
        userId.toString();

    let socketIds =
        connectedUsers.get(normalizedUserId);

    if (!socketIds) {
        socketIds = new Set();

        connectedUsers.set(
            normalizedUserId,
            socketIds
        );
    }

    socketIds.add(socketId);
}

/**
 * اتصال قطع‌شده کاربر را حذف می‌کند.
 */
export function removeUserSocket(
    userId,
    socketId
) {
    const normalizedUserId =
        userId.toString();

    const socketIds =
        connectedUsers.get(normalizedUserId);

    if (!socketIds) {
        return;
    }

    socketIds.delete(socketId);

    /*
     * فقط زمانی کاربر آفلاین است که
     * هیچ اتصال دیگری از او باقی نمانده باشد.
     */
    if (socketIds.size === 0) {
        connectedUsers.delete(
            normalizedUserId
        );
    }
}

/**
 * شناسه تمام کاربران آنلاین را برمی‌گرداند.
 */
export function getOnlineUserIds() {
    return Array.from(
        connectedUsers.keys()
    );
}

/**
 * لیست کاربران آنلاین را برای همه ارسال می‌کند.
 */
export function emitOnlineUsers() {
    if (!ioInstance) {
        return;
    }

    ioInstance.emit(
        "onlineUsers",
        getOnlineUserIds()
    );
}

/**
 * Socket.IO Server را راه‌اندازی می‌کند.
 */
export function initializeSocket(httpServer) {
    ioInstance = new Server(httpServer, {
        cors: {
            origin: env.clientUrl,
            credentials: true,
            methods: ["GET", "POST"],
        },
    });

    /*
     * این Middleware پیش از connection اجرا می‌شود.
     */
    ioInstance.use(authenticateSocket);

    ioInstance.on(
        "connection",
        (socket) => {
            const userId =
                socket.data.userId;

            /*
             * هر اتصال کاربر داخل Room خصوصی او قرار می‌گیرد.
             */
            socket.join(
                getUserRoom(userId)
            );

            addUserSocket(
                userId,
                socket.id
            );

            console.log(
                `Socket connected: ${socket.id} | User: ${userId}`
            );

            emitOnlineUsers();

            socket.on(
                "disconnect",
                (reason) => {
                    removeUserSocket(
                        userId,
                        socket.id
                    );

                    console.log(
                        `Socket disconnected: ${socket.id} | Reason: ${reason}`
                    );

                    emitOnlineUsers();
                }
            );
        }
    );

    return ioInstance;
}

/**
 * نمونه Socket.IO ساخته‌شده را برمی‌گرداند.
 */
export function getIO() {
    if (!ioInstance) {
        throw new Error(
            "Socket.IO has not been initialized."
        );
    }

    return ioInstance;
}
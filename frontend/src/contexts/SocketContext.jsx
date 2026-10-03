import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import { io } from "socket.io-client";

import { useAuth } from "../hooks/useAuth.js";

const SocketContext =
    createContext(null);

export function SocketProvider({
    children,
}) {
    const { user, isAuthenticated } =
        useAuth();

    const socketRef = useRef(null);

    const [isConnected, setIsConnected] =
        useState(false);

    const [connectionError, setConnectionError] =
        useState(null);

    const connectSocket =
        useCallback(() => {
            if (!isAuthenticated) {
                return;
            }

            if (socketRef.current) {
                return;
            }

            const socketUrl =
                import.meta.env
                    .VITE_SOCKET_URL;

            const socket = io(
                socketUrl,
                {
                    withCredentials: true,
                    transports: [
                        "websocket",
                        "polling",
                    ],
                }
            );

            socketRef.current =
                socket;

            socket.on(
                "connect",
                () => {
                    setIsConnected(true);
                    setConnectionError(null);
                }
            );

            socket.on(
                "disconnect",
                () => {
                    setIsConnected(false);
                }
            );

            socket.on(
                "connect_error",
                (error) => {
                    setIsConnected(false);

                    setConnectionError(
                        error.message
                    );
                }
            );
        }, [isAuthenticated]);

    const disconnectSocket =
        useCallback(() => {
            if (!socketRef.current) {
                return;
            }

            socketRef.current.disconnect();

            socketRef.current = null;

            setIsConnected(false);
        }, []);

    useEffect(() => {
        if (isAuthenticated) {
            connectSocket();
        } else {
            disconnectSocket();
        }

        return () => {
            disconnectSocket();
        };
    }, [
        isAuthenticated,
        connectSocket,
        disconnectSocket,
    ]);

    const value = useMemo(
        () => ({
            socket:
                socketRef.current,

            isConnected,

            connectionError,

            connectSocket,

            disconnectSocket,
        }),
        [
            isConnected,
            connectionError,
            connectSocket,
            disconnectSocket,
        ]
    );

    return (
        <SocketContext.Provider
            value={value}
        >
            {children}
        </SocketContext.Provider>
    );
}

export function useSocketContext() {
    return useContext(SocketContext);
}
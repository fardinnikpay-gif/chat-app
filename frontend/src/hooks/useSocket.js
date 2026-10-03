import {
    useContext,
} from "react";

import {
    useSocketContext,
} from "../contexts/SocketContext.jsx";

export function useSocket() {
    const context =
        useSocketContext();

    if (!context) {
        throw new Error(
            "useSocket must be used inside SocketProvider."
        );
    }

    return context;
}
import { BrowserRouter } from "react-router";
import { Toaster } from "react-hot-toast";

import {
    AuthProvider,
} from "../contexts/AuthContext.jsx";

import {
    SocketProvider,
} from "../contexts/SocketContext.jsx";

import {
    ChatProvider,
} from "../contexts/ChatContext.jsx";

export function AppProviders({
    children,
}) {
    return (
        <BrowserRouter>
            <AuthProvider>
                <SocketProvider>
                    <ChatProvider>
                        {children}

                        <Toaster
                            position="top-center"
                            reverseOrder={false}
                        />
                    </ChatProvider>
                </SocketProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}
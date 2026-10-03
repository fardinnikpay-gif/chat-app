import {
    Route,
    Routes,
} from "react-router";

import { LoginPage } from "../pages/LoginPage.jsx";
import { RegisterPage } from "../pages/RegisterPage.jsx";
import { ChatPage } from "../pages/ChatPage.jsx";
import { NotFoundPage } from "../pages/NotFoundPage.jsx";

import { ProtectedRoute } from "../routes/ProtectedRoute.jsx";
import { GuestRoute } from "../routes/GuestRoute.jsx";

export function AppRoutes() {
    return (
        <Routes>
            <Route
                path="/login"
                element={
                    <GuestRoute>
                        <LoginPage />
                    </GuestRoute>
                }
            />

            <Route
                path="/register"
                element={
                    <GuestRoute>
                        <RegisterPage />
                    </GuestRoute>
                }
            />

            <Route
                path="/chat"
                element={
                    <ProtectedRoute>
                        <ChatPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="*"
                element={
                    <NotFoundPage />
                }
            />
        </Routes>
    );
}
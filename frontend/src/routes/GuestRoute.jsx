import { Navigate } from "react-router";

import { useAuth } from "../hooks/useAuth.js";

export function GuestRoute({
    children,
}) {
    const {
        isAuthenticated,
        isLoading,
    } = useAuth();

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
            </div>
        );
    }

    if (isAuthenticated) {
        return (
            <Navigate
                to="/chat"
                replace
            />
        );
    }

    return children;
}
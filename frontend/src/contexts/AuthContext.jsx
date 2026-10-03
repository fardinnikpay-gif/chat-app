import {
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    getCurrentUser,
    login as loginApi,
    logout as logoutApi,
    register as registerApi,
} from "../api/auth.api.js";

import { getApiErrorMessage } from "../utils/getApiErrorMessage.js";

export const AuthContext =
    createContext(null);

export function AuthProvider({
    children,
}) {
    const [user, setUser] =
        useState(null);

    const [isLoading, setIsLoading] =
        useState(true);

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const [error, setError] =
        useState(null);

    const clearAuth = useCallback(() => {
        setUser(null);
        setError(null);
    }, []);

    const refreshUser =
        useCallback(async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response =
                    await getCurrentUser();

                setUser(
                    response.data.user
                );

                return response.data.user;
            } catch (error) {
                /*
                 * اگر Cookie وجود نداشته باشد
                 * یا Session معتبر نباشد،
                 * کاربر Login نیست.
                 */
                setUser(null);

                return null;
            } finally {
                setIsLoading(false);
            }
        }, []);

    const login = useCallback(
        async (credentials) => {
            try {
                setIsSubmitting(true);
                setError(null);

                const response =
                    await loginApi(
                        credentials
                    );

                setUser(
                    response.data.user
                );

                return {
                    success: true,
                    user: response.data.user,
                };
            } catch (error) {
                const message =
                    getApiErrorMessage(
                        error,
                        "Login failed."
                    );

                setError(message);

                return {
                    success: false,
                    error: message,
                };
            } finally {
                setIsSubmitting(false);
            }
        },
        []
    );

    const register = useCallback(
        async (userData) => {
            try {
                setIsSubmitting(true);
                setError(null);

                const response =
                    await registerApi(
                        userData
                    );

                setUser(
                    response.data.user
                );

                return {
                    success: true,
                    user: response.data.user,
                };
            } catch (error) {
                const message =
                    getApiErrorMessage(
                        error,
                        "Registration failed."
                    );

                setError(message);

                return {
                    success: false,
                    error: message,
                };
            } finally {
                setIsSubmitting(false);
            }
        },
        []
    );

    const logout = useCallback(
        async () => {
            try {
                setIsSubmitting(true);
                setError(null);

                await logoutApi();

                clearAuth();

                return {
                    success: true,
                };
            } catch (error) {
                const message =
                    getApiErrorMessage(
                        error,
                        "Logout failed."
                    );

                setError(message);

                /*
                 * حتی اگر API خطا داد،
                 * وضعیت Local را پاک می‌کنیم.
                 */
                clearAuth();

                return {
                    success: false,
                    error: message,
                };
            } finally {
                setIsSubmitting(false);
            }
        },
        [clearAuth]
    );

    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    const value = useMemo(
        () => ({
            user,

            isLoading,
            isSubmitting,

            error,

            isAuthenticated:
                Boolean(user),

            login,
            register,
            logout,

            refreshUser,
            clearAuth,
        }),
        [
            user,
            isLoading,
            isSubmitting,
            error,
            login,
            register,
            logout,
            refreshUser,
            clearAuth,
        ]
    );

    return (
        <AuthContext.Provider
            value={value}
        >
            {children}
        </AuthContext.Provider>
    );
}
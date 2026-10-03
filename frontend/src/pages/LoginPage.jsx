import { Link, useNavigate } from "react-router";
import { toast } from "react-hot-toast";

import { AuthForm } from "../components/auth/AuthForm.jsx";
import { useAuth } from "../hooks/useAuth.js";

export function LoginPage() {
    const navigate = useNavigate();

    const {
        login,
        isSubmitting,
        error,
    } = useAuth();

    async function handleLogin(
        formData
    ) {
        const result =
            await login({
                email: formData.email,
                password:
                    formData.password,
            });

        if (!result.success) {
            return;
        }

        toast.success(
            "Welcome back!"
        );

        navigate("/chat", {
            replace: true,
        });
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8">
            <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome back
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Login to your account
                    </p>
                </div>

                <AuthForm
                    mode="login"
                    onSubmit={
                        handleLogin
                    }
                    isSubmitting={
                        isSubmitting
                    }
                    error={error}
                />

                <p className="mt-6 text-center text-sm text-gray-500">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="font-semibold text-blue-600 hover:text-blue-700"
                    >
                        Create one
                    </Link>
                </p>
            </div>
        </main>
    );
}
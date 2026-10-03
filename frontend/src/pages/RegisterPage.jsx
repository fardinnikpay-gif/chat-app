import {
    Link,
    useNavigate,
} from "react-router";

import { toast } from "react-hot-toast";

import { AuthForm } from "../components/auth/AuthForm.jsx";
import { useAuth } from "../hooks/useAuth.js";

export function RegisterPage() {
    const navigate = useNavigate();

    const {
        register,
        isSubmitting,
        error,
    } = useAuth();

    async function handleRegister(
        formData
    ) {
        const result =
            await register({
                fullName:
                    formData.fullName,
                email: formData.email,
                password:
                    formData.password,
            });

        if (!result.success) {
            return;
        }

        toast.success(
            "Account created successfully!"
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
                        Create account
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Join the chat
                    </p>
                </div>

                <AuthForm
                    mode="register"
                    onSubmit={
                        handleRegister
                    }
                    isSubmitting={
                        isSubmitting
                    }
                    error={error}
                />

                <p className="mt-6 text-center text-sm text-gray-500">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="font-semibold text-blue-600 hover:text-blue-700"
                    >
                        Login
                    </Link>
                </p>
            </div>
        </main>
    );
}
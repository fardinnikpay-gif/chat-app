import { useState } from "react";

import { useAuth } from "../../hooks/useAuth.js";

import { Button } from "../common/Button.jsx";
import { Input } from "../common/Input.jsx";
import { ErrorMessage } from "../common/ErrorMessage.jsx";

function getInitialValues(mode) {
    if (mode === "register") {
        return {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
        };
    }

    return {
        email: "",
        password: "",
    };
}

export function AuthForm({
    mode = "login",
    onSuccess,
}) {
    const {
        login,
        register,
        isSubmitting,
        error,
        clearAuth,
    } = useAuth();

    const [formData, setFormData] =
        useState(
            getInitialValues(mode)
        );

    const [validationError, setValidationError] =
        useState("");

    function handleChange(event) {
        const {
            name,
            value,
        } = event.target;

        setFormData(
            (previous) => ({
                ...previous,
                [name]: value,
            })
        );

        setValidationError("");

        if (error) {
            clearAuth();
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setValidationError("");

        if (mode === "register") {
            if (
                formData.password !==
                formData.confirmPassword
            ) {
                setValidationError(
                    "Passwords do not match."
                );

                return;
            }

            if (
                formData.password.length < 6
            ) {
                setValidationError(
                    "Password must be at least 6 characters."
                );

                return;
            }

            const result =
                await register({
                    fullName:
                        formData.fullName.trim(),
                    email:
                        formData.email
                            .trim(),
                    password:
                        formData.password,
                });

            if (
                result.success &&
                onSuccess
            ) {
                onSuccess(result);
            }

            return;
        }

        const result =
            await login({
                email:
                    formData.email.trim(),
                password:
                    formData.password,
            });

        if (
            result.success &&
            onSuccess
        ) {
            onSuccess(result);
        }
    }

    const isRegister =
        mode === "register";

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-5"
        >
            <ErrorMessage
                message={
                    validationError ||
                    error
                }
                onClose={() => {
                    setValidationError("");
                    clearAuth();
                }}
            />

            {isRegister && (
                <Input
                    label="Full name"
                    name="fullName"
                    value={
                        formData.fullName
                    }
                    onChange={
                        handleChange
                    }
                    placeholder="John Doe"
                    autoComplete="name"
                    required
                />
            )}

            <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
            />

            <Input
                label="Password"
                name="password"
                type="password"
                value={
                    formData.password
                }
                onChange={
                    handleChange
                }
                placeholder="••••••••"
                autoComplete={
                    isRegister
                        ? "new-password"
                        : "current-password"
                }
                required
            />

            {isRegister && (
                <Input
                    label="Confirm password"
                    name="confirmPassword"
                    type="password"
                    value={
                        formData.confirmPassword
                    }
                    onChange={
                        handleChange
                    }
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                />
            )}

            <Button
                type="submit"
                loading={isSubmitting}
            >
                {isRegister
                    ? "Create account"
                    : "Login"}
            </Button>
        </form>
    );
}
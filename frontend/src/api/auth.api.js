import axiosClient from "./axiosClient.js";

export async function register(
    userData
) {
    const response =
        await axiosClient.post(
            "/auth/register",
            userData
        );

    return response.data;
}

export async function login(
    credentials
) {
    const response =
        await axiosClient.post(
            "/auth/login",
            credentials
        );

    return response.data;
}

export async function logout() {
    const response =
        await axiosClient.post(
            "/auth/logout"
        );

    return response.data;
}

export async function getCurrentUser() {
    const response =
        await axiosClient.get(
            "/auth/me"
        );

    return response.data;
}
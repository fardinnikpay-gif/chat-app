import axiosClient from "./axiosClient.js";

export async function getMessages(
    userId,
    params = {}
) {
    const response =
        await axiosClient.get(
            `/messages/${userId}`,
            {
                params,
            }
        );

    return response.data;
}

export async function sendMessage(
    userId,
    text
) {
    const response =
        await axiosClient.post(
            `/messages/${userId}`,
            {
                text,
            }
        );

    return response.data;
}
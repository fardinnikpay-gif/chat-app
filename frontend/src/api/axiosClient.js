import axios from "axios";

const API_URL =
    import.meta.env.VITE_API_URL;

export function createAxiosClient() {
    return axios.create({
        baseURL: API_URL,
        withCredentials: true,
        headers: {
            "Content-Type":
                "application/json",
        },
        timeout: 15000,
    });
}

export function setupInterceptors(
    client
) {
    client.interceptors.response.use(
        (response) => {
            return response;
        },

        (error) => {
            if (!error.response) {
                return Promise.reject(
                    new Error(
                        "Unable to connect to the server."
                    )
                );
            }

            return Promise.reject(error);
        }
    );

    return client;
}

const axiosClient =
    setupInterceptors(
        createAxiosClient()
    );

export default axiosClient;
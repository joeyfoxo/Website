import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/auth";

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
});

function handleError(error) {
    if (error.response) {
        const status = error.response.status;
        if (status === 401) throw new Error("Invalid username or password.");
        if (status === 403) throw new Error("Registration restricted to @joeyfox.dev emails.");
        if (status === 409) throw new Error("Username or Email already exists.");

        throw new Error(error.response.data || "An unexpected error occurred");
    }
    throw new Error("Server unreachable. Please check your connection.");
}

export async function login(username, password) {
    try {
        // CLEAN: Sending a JSON body, not manual Basic Auth headers
        const response = await api.post("/login", { username, password });
        return response.data;
    } catch (error) {
        handleError(error);
    }
}

export async function register(username, password, email) {
    try {
        const response = await api.post("/register", {
            username,
            password,
            email,
            role: "AUTHENTICATED"
        });
        return response.data;
    } catch (error) {
        handleError(error);
    }
}

export async function fetchUserProfile() {
    try {
        const response = await api.get("/profile");
        return response.data;
    } catch (error) {
        handleError(error);
    }
}

export async function logout() {
    try {
        const response = await api.post("/logout");
        return response.data;
    } catch (error) {
        handleError(error);
    }
}
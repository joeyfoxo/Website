import axios from "axios";


const authApi = axios.create({
    baseURL: "/api/auth",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
});

const adminApi = axios.create({
    baseURL: "/api/admin",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
});

function handleError(error) {
    if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        // 1. If the backend sent a direct error message, use it!
        if (data) {
            // Handles cases where backend sends a raw string (like your custom controller responses)
            if (typeof data === 'string') throw new Error(data);

            // Handles cases where Spring Boot sends its standard error object map
            if (data.message) throw new Error(data.message);
        }

        // 2. Global contextual fallbacks if the backend didn't provide a specific message body
        if (status === 401) throw new Error("Session expired. Please log in again.");
        if (status === 403) throw new Error("Access denied. You do not have permission to view this resource.");
        if (status === 409) throw new Error("A conflict occurred. This resource may already exist.");

        throw new Error(`Server returned error status: ${status}`);
    }

    throw new Error("Server unreachable. Please check your network connection.");
}
export async function login(username, password) {
    try {
        // CLEAN: Sending a JSON body, not manual Basic Auth headers
        const response = await authApi.post("/login", { username, password });;
        return response.data;
    } catch (error) {
        handleError(error);
    }
}

export async function register(username, password, email) {
    try {
        const response = await authApi.post("/register", {
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

export async function logout() {
    try {
        const response = await authApi.post("/logout");
        return response.data;
    } catch (error) {
        handleError(error);
    }
}

export async function getProfile() {
    try {
        const response = await authApi.get("/profile");
        return response.data;
    }
    catch (error) {
        handleError(error);
    }
}


    export async function fetchAllUsers() {
        try {
            // This hits the /admin/users endpoint you just created in Java
            const response = await adminApi.get("/users");
            return response.data;
        } catch (error) {
            // You might want to add a 403 specific error here for "Admin only"
            handleError(error);
        }
}

export async function updateUserRole(email, newRole) {
    try {
        const response = await adminApi.put(`/users/${email}/role`, { role: newRole });
        return response.data;
    } catch (error) {
        handleError(error);
    }
}
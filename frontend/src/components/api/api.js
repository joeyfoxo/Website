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

const filesApi = axios.create({
    baseURL: "/api/files",
    withCredentials: true,
    headers: {
        "Accept": "application/json"
    }
});

function handleError(error) {
    if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        if (data) {
            if (typeof data === 'string') throw new Error(data);
            if (data.message) throw new Error(data.message);
        }

        if (status === 401) throw new Error("Session expired. Please log in again.");
        if (status === 403) throw new Error("Access denied. You do not have permission to view this resource.");
        if (status === 409) throw new Error("A conflict occurred. This resource may already exist.");

        throw new Error(`Server returned error status: ${status}`);
    }

    throw new Error("Server unreachable. Please check your network connection.");
}

export async function login(username, password) {
    try {
        const response = await authApi.post("/login", { username, password });
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
    } catch (error) {
        handleError(error);
    }
}

export async function fetchAllUsers() {
    try {
        const response = await adminApi.get("/users");
        return response.data;
    } catch (error) {
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

/**
 * Creates a brand new folder directory sub-node
 */
export async function createFolder(folderName, role, path = "") {
    try {
        const response = await filesApi.post("/folder", { folderName, role, path });
        return response.data;
    } catch (error) {
        handleError(error);
    }
}

/**
 * Uploads a file inside a specific directory level, handling administrative overrides
 */
export async function uploadFile(file, role = null, path = "") {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const params = {};
        if (role) params.role = role;
        if (path) params.path = path;

        const response = await filesApi.post("/upload", formData, {
            params,
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    } catch (error) {
        handleError(error);
    }
}

export async function fetchFiles(path = "") {
    try {
        const response = await filesApi.get("", {
            params: { path }
        });
        return response.data;
    } catch (error) {
        handleError(error);
    }
}

export async function fetchFilesByRole(role, path = "") {
    try {
        const response = await filesApi.get("", {
            params: { role, path }
        });
        return response.data;
    } catch (error) {
        handleError(error);
    }
}

/**
 * Deletes a file or directory tree inside a specific structural sub-node path
 */
export async function deleteFile(filename, role, path = "") {
    try {
        const response = await filesApi.delete(`/delete/${filename}`, {
            params: { role, path }
        });
        return response.data;
    } catch (error) {
        handleError(error);
    }
}

/**
 * Renames an object passing full metadata via JSON payload bodies
 */
export async function renameFile(filename, newDisplayName, role, path = "") {
    try {
        const response = await filesApi.put("/rename",
            { filename, newDisplayName, role, path },
            { headers: { "Content-Type": "application/json" } }
        );
        return response.data;
    } catch (error) {
        handleError(error);
    }
}

/**
 * Downloads a binary asset block targeting a precise path context
 */
export async function downloadFile(filename, displayName, role = null, path = "") {
    try {
        const params = {};
        if (role) params.role = role;
        if (path) params.path = path;

        const response = await filesApi.get(`/download/${filename}`, {
            responseType: 'blob',
            params
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', displayName);
        document.body.appendChild(link);
        link.click();

        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        handleError(error);
    }
}
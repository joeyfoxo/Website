import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { Box } from "@mui/material"; // 🚀 Imported to manage background shell color natively
import { getProfile } from "../api/api.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    // Use a Ref to ensure we only check the session once per page load
    const hasChecked = useRef(false);

    const verifySession = async () => {
        if (hasChecked.current) return; // Stop the loop if we've already checked

        try {
            const userData = await getProfile();
            setUser(userData);
        } catch (err) {
            // Fail completely silently. User state stays null.
            setUser(null);
        } finally {
            setLoading(false);
            hasChecked.current = true; // Mark as checked
        }
    };

    useEffect(() => {
        verifySession();
    }, []);

    // 🛡️ Kill the white flash right at the root provider level
    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    width: "100vw",
                    bgcolor: "background.default", // Pulls your exact light/dark mode canvas color instantly
                    color: "text.primary"
                }}
            />
        );
    }

    return (
        <AuthContext.Provider value={{ user, setUser, loading, verifySession, isEditing, setIsEditing }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import {getProfile} from "../api/api.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    // Use a Ref to ensure we only check the session once per page load
    const hasChecked = useRef(false);

    const verifySession = async () => {
        if (hasChecked.current) return; // Stop the loop if we've already checked

        try {
            const userData = await getProfile();
            setUser(userData);
        } catch (err) {
            setUser(null);
            // If it's a 403/401, we know the session is dead.
            // Don't throw the error further or it might trigger global error handlers
        } finally {
            setLoading(false);
            hasChecked.current = true; // Mark as checked
        }
    };

    useEffect(() => {
        verifySession();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading, verifySession }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
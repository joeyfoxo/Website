import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { Logout } from "@mui/icons-material";
import { logout } from "../api/api.js";
import { useAuth } from "../login/AuthContext.jsx"; // Adjust path if needed

export default function LogoutButton({ sx }) {
    const { setUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
        } finally {
            // Immediate UI feedback: wipe user state and bounce to home/login
            setUser(null);
            navigate("/", { replace: true });
        }
    };

    return (
        <Button
            startIcon={<Logout />}
            onClick={handleLogout}
            sx={{
                textTransform: "none",
                fontWeight: 600,
                ...sx // Allows custom styling to be injected from parent components
            }}
        >
            Sign Out
        </Button>
    );
}
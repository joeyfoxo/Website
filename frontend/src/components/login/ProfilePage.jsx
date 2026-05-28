import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box, Button, Typography, Paper, Container,
    CircularProgress, IconButton, useTheme, Avatar, Divider, Stack, Chip
} from "@mui/material";
import { ArrowBackIosNew, Logout, Email, Security } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { getProfile, logout } from "../api/api.js";
import { useAuth } from "./AuthContext.jsx";

const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.4 } }
};

export default function ProfilePage() {
    const theme = useTheme();
    const [loading, setLoading] = useState(true);
    const [isExiting, setIsExiting] = useState(false);

    // FIX: You need to pull 'user' here to display it in the JSX
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const userData = await getProfile();
                // This updates the global state so your Sidebar/Header also updates
                setUser(userData);
            } catch (err) {
                // If the session is dead (403), clear local state and kick to auth
                setUser(null);
                navigate("/auth");
            } finally {
                setLoading(false);
            }
        };
        loadProfile();
    }, [navigate, setUser]);

    const handleBack = () => {
        setIsExiting(true);
        setTimeout(() => navigate("/"), 350);
    };

    const handleLogout = async () => {
        try {
            await logout();
        } finally {
            // Immediate UI feedback: user is gone, sidebar reverts to "James"
            setUser(null);
            navigate("/", { replace: true });
        }
    };

    if (loading) {
        return (
            <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: theme.palette.background.default }}>
                <CircularProgress color="primary" />
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: theme.palette.background.default, display: "flex", alignItems: "center", justifyContent: "center", p: 3 }}>
            <Container maxWidth="sm">
                <AnimatePresence mode="wait">
                    {!isExiting && (
                        <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
                            <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <IconButton onClick={handleBack} sx={{ color: theme.palette.text.secondary }}>
                                    <ArrowBackIosNew fontSize="small" />
                                    <Typography variant="body2" sx={{ ml: 1, fontWeight: 500 }}>Back</Typography>
                                </IconButton>

                                <Button
                                    startIcon={<Logout />}
                                    onClick={handleLogout}
                                    sx={{ textTransform: "none", color: theme.palette.error.main, fontWeight: 600 }}
                                >
                                    Sign Out
                                </Button>
                            </Box>

                            <Paper elevation={0} sx={{ p: { xs: 4, md: 6 }, borderRadius: 5, border: "1px solid", borderColor: theme.palette.divider, bgcolor: theme.palette.background.paper }}>
                                <Avatar
                                    sx={{
                                        width: 80, height: 80, margin: "0 auto 24px",
                                        bgcolor: theme.palette.primary.main, fontSize: "2rem", fontWeight: 700
                                    }}
                                >
                                    {/* Now correctly accesses user from context */}
                                    {user?.username?.charAt(0).toUpperCase() || "J"}
                                </Avatar>

                                <Typography variant="h4" align="center" sx={{ fontWeight: 800, mb: 1 }}>
                                    {user?.username}
                                </Typography>

                                <Stack direction="row" justifyContent="center" spacing={1} sx={{ mb: 4 }}>
                                    <Chip
                                        label={user?.role || "AUTHENTICATED"}
                                        size="small"
                                        sx={{ fontWeight: 700, bgcolor: theme.palette.action.hover, color: theme.palette.primary.main }}
                                    />
                                </Stack>

                                <Divider sx={{ mb: 4 }} />

                                <Stack spacing={3}>
                                    <Box>
                                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 700, display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                                            <Email fontSize="inherit" /> EMAIL ADDRESS
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            {user?.email}
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 700, display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                                            <Security fontSize="inherit" /> PERMISSIONS
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                                            Access granted to developer tools and system configurations.
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Paper>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Container>
        </Box>
    );
}
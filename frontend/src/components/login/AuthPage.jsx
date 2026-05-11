import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Link,
    Paper,
    TextField,
    Typography,
    useTheme,
    IconButton
} from "@mui/material";
import { ArrowBackIosNew as BackIcon } from "@mui/icons-material";
import { login, register } from "../api/api.js";
import { useAuth } from "./AuthContext.jsx";

export default function AuthPage() {
    const theme = useTheme();
    const navigate = useNavigate();
    const { user, setUser, loading: authLoading } = useAuth();

    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ email: "", password: "", username: "" });
    const [feedback, setFeedback] = useState({ type: "", message: "" });

    useEffect(() => {
        if (!authLoading && user && user.username) {
            navigate("/account", { replace: true });
        }
    }, [user, authLoading, navigate]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleBack = () => {
        navigate("/");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFeedback({ type: "", message: "" });

        try {
            if (isLogin) {
                const userData = await login(form.username, form.password);
                setUser(userData);
                navigate("/account");
            } else {
                const data = await register(form.username, form.password, form.email);
                setFeedback({ type: "success", message: "Registration successful! Please sign in." });
                setIsLogin(true);
                // Reset form fields except username for convenience
                setForm(prev => ({ ...prev, password: "", email: "" }));
            }
        } catch (err) {
            setFeedback({ type: "error", message: err.message });
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = (e) => {
        e.preventDefault();
        setIsLogin(!isLogin);
        setFeedback({ type: "", message: "" });
    };

    return (
        <Box sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: theme.palette.background.default
        }}>
            <Container maxWidth="xs">
                {/* Back Button positioned above the Paper */}
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <IconButton
                        onClick={handleBack}
                        sx={{
                            color: theme.palette.text.secondary,
                            transition: 'all 0.2s',
                            '&:hover': { color: theme.palette.primary.main, bgcolor: 'transparent' }
                        }}
                    >
                        <BackIcon sx={{ fontSize: 18, mr: 0.5 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>Back</Typography>
                    </IconButton>
                </Box>

                <Paper
                    elevation={0}
                    sx={{
                        p: 5,
                        borderRadius: 5,
                        border: "1px solid",
                        borderColor: theme.palette.divider,
                        bgcolor: theme.palette.background.paper,
                        boxShadow: "0px 10px 30px rgba(0,0,0,0.05)"
                    }}
                >
                    <Typography variant="h4" align="center" sx={{ mb: 1, fontWeight: 800 }}>
                        {isLogin ? "Welcome back" : "Join us"}
                    </Typography>

                    <Typography variant="body2" align="center" sx={{ mb: 4, color: theme.palette.text.secondary }}>
                        {isLogin ? "Sign in to manage your server" : "Create an account to start building"}
                    </Typography>

                    {feedback.message && (
                        <Alert severity={feedback.type} sx={{ mb: 3, borderRadius: 2 }}>
                            {feedback.message}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label={isLogin ? "Username" : "Email (@joeyfox.dev)"}
                            name={isLogin ? "username" : "email"}
                            autoComplete={isLogin ? "username" : "email"}
                            value={isLogin ? form.username : form.email}
                            onChange={handleChange}
                            variant="filled"
                            InputProps={{
                                disableUnderline: true,
                                sx: { borderRadius: 2, bgcolor: theme.palette.action.hover }
                            }}
                        />

                        {!isLogin && (
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Display Username"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                variant="filled"
                                InputProps={{
                                    disableUnderline: true,
                                    sx: { borderRadius: 2, bgcolor: theme.palette.action.hover }
                                }}
                            />
                        )}

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            autoComplete={isLogin ? "current-password" : "new-password"}
                            value={form.password}
                            onChange={handleChange}
                            variant="filled"
                            InputProps={{
                                disableUnderline: true,
                                sx: { borderRadius: 2, bgcolor: theme.palette.action.hover }
                            }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            sx={{
                                mt: 4,
                                py: 1.8,
                                borderRadius: 2.5,
                                fontWeight: 700,
                                textTransform: "none",
                                fontSize: '1rem',
                                boxShadow: 'none',
                                '&:hover': { boxShadow: 'none' }
                            }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : (isLogin ? "Sign In" : "Register")}
                        </Button>

                        <Box sx={{ mt: 3, textAlign: "center" }}>
                            <Link
                                component="button"
                                variant="body2"
                                onClick={toggleMode}
                                sx={{
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                    color: theme.palette.primary.main
                                }}
                            >
                                {isLogin ? "Need an account? Sign Up" : "Already have an account? Sign In"}
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}
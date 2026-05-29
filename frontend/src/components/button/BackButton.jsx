import React from "react";
import { useNavigate } from "react-router-dom";
import { IconButton, Typography, useTheme } from "@mui/material";
import { ArrowBackIosNew } from "@mui/icons-material";

export default function BackButton({ to }) {
    const theme = useTheme();
    const navigate = useNavigate();

    const handleBack = () => {
        // If the browser has history, go back one step. Otherwise, go to the fallback path
        if (window.history.state && window.history.length > 1) {
            navigate(-1);
        } else if (to) {
            navigate(to);
        } else {
            navigate("/"); // Absolute safety fallback
        }
    };

    return (
        <IconButton
            onClick={handleBack}
            sx={{ color: theme.palette.text.secondary, p: 1 }}
        >
            <ArrowBackIosNew fontSize="small" />
            <Typography variant="body2" sx={{ ml: 1, fontWeight: 500 }}>
                Back
            </Typography>
        </IconButton>
    );
}
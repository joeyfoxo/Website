import React from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { Edit as EditIcon, Check as CheckIcon } from '@mui/icons-material';
import {useAuth} from "../../login/AuthContext.jsx";

export default function EditModeToggle() {
    const theme = useTheme();
    // Pull the global editing states and user info
    const { user, loading, isEditing, setIsEditing } = useAuth();

    if (loading) return null;

    // Check if user is JOEY (0)
    const isJoey = user && user.role?.rank === 0;
    if (!isJoey) return null;

    return (
        <Box sx={{ position: 'fixed', top: 24, right: 24, zIndex: 9999 }}>
            <Button
                onClick={() => setIsEditing(!isEditing)}
                startIcon={isEditing ? <CheckIcon /> : <EditIcon />}
                sx={{
                    backgroundColor: isEditing ? theme.palette.success.main : theme.palette.primary.main,
                    color: '#fff',
                    borderRadius: 4, // Squircle profile
                    px: 3,
                    py: 1.5,
                    boxShadow: 3,
                    textTransform: 'none',
                    fontWeight: 'bold',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        backgroundColor: isEditing ? theme.palette.success.dark : theme.palette.primary.dark,
                        transform: 'translateY(-2px)',
                        boxShadow: 6,
                    }
                }}
            >
                {isEditing ? "Finish Editing" : "Edit Site"}
            </Button>

            {isEditing && (
                <Typography
                    variant="caption"
                    sx={{
                        position: 'absolute', bottom: -24, right: 0,
                        color: theme.palette.success.main, fontWeight: 700,
                        letterSpacing: 0.5, whiteSpace: 'nowrap'
                    }}
                >
                    ● LIVE EDIT MODE ACTIVE
                </Typography>
            )}
        </Box>
    );
}
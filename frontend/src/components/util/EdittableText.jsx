import React, { useState, useEffect } from 'react';
import { TextField, Box, Typography, useTheme, Link } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../login/AuthContext.jsx'; // Adjust path if needed

export default function EditableText({ sectionId, defaultText, variant = "body1", sx, ...props }) {
    const theme = useTheme();
    const { isEditing } = useAuth();
    const [text, setText] = useState(defaultText);

    useEffect(() => {
        setText(defaultText);
    }, [defaultText]);

    // Automatically sync changes to local storage when leaving edit mode
    useEffect(() => {
        if (!isEditing) {
            localStorage.setItem(`content_${sectionId}`, text);
        }
    }, [isEditing, text, sectionId]);

    // Safely extract the theme typography properties for this variant
    const variantStyles = theme.typography[variant] || {};

    if (isEditing) {
        return (
            <Box sx={{ my: 1, width: '100%' }}>
                <TextField
                    variant="outlined"
                    fullWidth
                    multiline
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    sx={{
                        // Preserves text alignment properties if passed down via sx
                        textAlign: sx?.textAlign,

                        '& .MuiOutlinedInput-root': {
                            backgroundColor: theme.palette.action.hover,
                            borderRadius: 2,
                            '& fieldset': { borderColor: 'rgba(156, 39, 176, 0.3)', borderWidth: '1.5px' },
                            '&:hover fieldset': { borderColor: 'rgba(156, 39, 176, 0.6)' },
                            '&.Mui-focused fieldset': { borderColor: '#9c27b0' },
                        },
                        '& .MuiInputBase-input': {
                            // 1. Applies the typography variant specs
                            fontSize: variantStyles.fontSize,
                            fontWeight: variantStyles.fontWeight,
                            fontFamily: variantStyles.fontFamily,
                            lineHeight: variantStyles.lineHeight,
                            letterSpacing: variantStyles.letterSpacing,

                            // 2. Overlays custom variations (like color) passed from About.jsx
                            ...sx,
                        },
                    }}
                />
            </Box>
        );
    }

    return (
        <Typography variant={variant} sx={sx} {...props}>
            <ReactMarkdown
                components={{
                    // Unwraps the markdown paragraph container to prevent HTML nesting errors
                    p: React.Fragment,

                    // Maps Markdown links to your customized MUI Link component
                    a: ({ href, children }) => (
                        <Link
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ color: theme.palette.textColors.link }}
                        >
                            {children}
                        </Link>
                    )
                }}
            >
                {text}
            </ReactMarkdown>
        </Typography>
    );
}
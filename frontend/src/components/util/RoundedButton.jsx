import React from 'react';
import { Typography, useTheme, alpha } from '@mui/material';

export default function RoundedButton({ href, children, ...props }) {
    const theme = useTheme();

    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: 'none' }}
            {...props}
        >
            <Typography
                component="span"
                sx={{
                    display: 'inline-block',
                    color: theme.palette.primary.main,
                    border: `2px solid ${theme.palette.textColors.span}`,
                    fontSize: '25px',
                    fontWeight: 400,
                    backgroundColor: alpha(theme.palette.primary.main, 0.1), // 10% transparent
                    borderRadius: '20px',
                    width: '100%',
                    px: 2,
                    py: 1,
                    textAlign: 'center',
                    transition: 'background-color 0.2s',
                    '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.3),
                    },
                }}
            >
                {children}
            </Typography>
        </a>
    );
}
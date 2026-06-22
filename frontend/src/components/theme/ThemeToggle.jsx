import React, { useContext } from 'react';
import { IconButton } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { ColorModeContext } from './ThemeContext';

export default function ThemeToggle() {
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);

    return (
        <IconButton onClick={colorMode.toggleColorMode} color="inherit">
            {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
    );
}
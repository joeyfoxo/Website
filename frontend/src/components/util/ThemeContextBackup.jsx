import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createContext, useMemo, useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { GlobalStyles } from '@mui/system';

export const ColorModeContext = createContext();

export const ThemeContextProvider = ({ children }) => {
    const [mode, setMode] = useState(() =>
        localStorage.getItem('theme') || 'light'
    );

    useEffect(() => {
        localStorage.setItem('theme', mode);
    }, [mode]);

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () =>
                setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light')),
        }),
        []
    );

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    background: {
                        default: mode === 'dark' ? '#121212' : '#fff7f7',
                        paper: mode === 'dark' ? '#1e0000' : '#ffe0e0',
                    },
                    text: {
                        primary: mode === 'dark' ? '#fff5f5' : '#4c0000',
                        secondary: mode === 'dark' ? '#351b1b' : '#fff5f5',
                    },
                    primary: {
                        main: mode === 'dark' ? '#ff8282' : '#ff4848',
                    },
                    textColors: {
                        span: mode === 'dark' ? '#e14236' : '#8f2626',
                        util: mode === 'dark' ? '#d3a3a3' : '#c08888',
                        link: mode === 'dark' ? '#ff8080' : '#cd0a0a',
                        linkHover: mode === 'dark' ? '#bf2b2b' : '#750000',
                        primaryDark: mode === 'dark' ? '#4e0000' : '#373434',
                        label: mode === 'dark' ? '#f9e4e4' : '#ffd2d2',
                        error: '#ef5350',
                        success: '#66bb6a',
                    },
                },
                components: {
                    MuiCssBaseline: {
                        styleOverrides: {
                            body: {
                                height: '100%',
                                transition: 'background-color 1s ease, color 1s ease',
                            },
                        },
                    },
                    MuiLink: {
                        styleOverrides: {
                            root: ({ theme }) => ({
                                fontWeight: 'bold',
                                textDecoration: 'none',
                                transition: 'color 1s ease',
                                '&:hover': {
                                    textDecoration: 'none',
                                    color: theme.palette.textColors.linkHover,
                                },
                            }),
                        },
                    },
                    MuiTypography: {
                        styleOverrides: {
                            root: {
                                transition: 'color 1s ease',
                            },
                        },
                    },
                },
            }),
        [mode]
    );

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {/* Global style for anchor tags with dynamic theme-based color */}
                <GlobalStyles
                    styles={{
                        a: {
                            color: theme.palette.textColors.link,
                            fontWeight: 'bold',
                            textDecoration: 'none',
                            transition: 'color 1s ease',
                            '&:hover': {
                                textDecoration: 'none',
                            },
                        },
                        i: {
                            transition: 'color 0.3s ease',
                            color: theme.palette.text.primary,
                        },
                        '.nav-menu li:hover a i': {
                            color: theme.palette.textColors.linkHover,
                        },
                    }}
                />
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};
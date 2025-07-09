import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createContext, useMemo, useState, useEffect, useCallback } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { GlobalStyles } from '@mui/system';

export const ColorModeContext = createContext();

export const ThemeContextProvider = ({ children }) => {
    const [mode, setMode] = useState(() =>
        localStorage.getItem('themeMode') || 'dark'
    );

    const [hue, setHue] = useState(() =>
        localStorage.getItem('themeHue') || 'red'
    );

    useEffect(() => {
        localStorage.setItem('themeMode', mode);
    }, [mode]);

    useEffect(() => {
        localStorage.setItem('themeHue', hue);
    }, [hue]);

    // Memoize toggleColorMode and setHue functions
    const toggleColorMode = useCallback(() => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    }, []);

    const setHueCallback = useCallback((newHue) => {
        setHue(newHue);
    }, []);

    // Provide current mode and hue too if you want
    const colorMode = useMemo(() => ({
        toggleColorMode,
        setHue: setHueCallback,
        mode,
        hue,
    }), [toggleColorMode, setHueCallback, mode, hue]);

    const huePresets = {
        red: {
            backgroundDefaultLightRed: '#fff7f7',
            backgroundDefaultDarkRed: '#121212',

            backgroundPaperLightRed: '#ffe0e0',
            backgroundPaperDarkRed: '#1e0000',

            primaryMainLightRed: '#ff4848',
            primaryMainDarkRed: '#ff8282',

            textPrimaryLightRed: '#4c0000',
            textPrimaryDarkRed: '#ffffff',

            textColorsLightLinkRed: '#ff6b6b',
            textColorsLightLinkHoverRed: '#bf2b2b',

            textColorsDarkLinkRed: '#cd0a0a',
            textColorsDarkLinkHoverRed: '#750000',

            textColorsSpanLightRed: '#cd0a0a',
            textColorsSpanDarkRed: '#b33030',

            textColorsPrimaryDarkRed: '#4e0000',
        },
        yellow: {
            backgroundDefaultLightYellow: '#fffbee',
            backgroundDefaultDarkYellow: '#0e0c00',

            backgroundPaperLightYellow: '#fff2a8',
            backgroundPaperDarkYellow: '#252200',

            primaryMainLightYellow: '#ffcc33',
            primaryMainDarkYellow: '#ffdd66',

            textPrimaryLightYellow: '#4d4400',
            textPrimaryDarkYellow: '#fffde3',

            textColorsLightLinkYellow: '#ffdd66',
            textColorsLightLinkHoverYellow: '#bfa829',

            textColorsDarkLinkYellow: '#d4a000',
            textColorsDarkLinkHoverYellow: '#715d00',

            textColorsSpanLightYellow: '#d4a000',
            textColorsSpanDarkYellow: '#715d00',

            textColorsPrimaryDarkYellow: '#4d3b00',
        },
        green: {
            backgroundDefaultLightGreen: '#f3fff4',
            backgroundDefaultDarkGreen: '#0a1a0a',

            backgroundPaperLightGreen: '#c8f5c9',
            backgroundPaperDarkGreen: '#1c321c',

            primaryMainLightGreen: '#55bb55',
            primaryMainDarkGreen: '#88cc88',

            textPrimaryLightGreen: '#0a2f0a',
            textPrimaryDarkGreen: '#e8f5e8',

            textColorsLightLinkGreen: '#88cc88',
            textColorsLightLinkHoverGreen: '#5fa65f',

            textColorsDarkLinkGreen: '#2e7d32',
            textColorsDarkLinkHoverGreen: '#1b5e20',

            textColorsSpanLightGreen: '#2e7d32',
            textColorsSpanDarkGreen: '#1b5e20',

            textColorsPrimaryDarkGreen: '#0d2e0d',
        },
        blue: {
            backgroundDefaultLightBlue: '#f2faff',
            backgroundDefaultDarkBlue: '#0b101a',

            backgroundPaperLightBlue: '#cde1ff',
            backgroundPaperDarkBlue: '#11263b',

            primaryMainLightBlue: '#4a90e2',
            primaryMainDarkBlue: '#7ab0ff',

            textPrimaryLightBlue: '#021f3a',
            textPrimaryDarkBlue: '#ddeeff',

            textColorsLightLinkBlue: '#7ab0ff',
            textColorsLightLinkHoverBlue: '#3d65a7',

            textColorsDarkLinkBlue: '#0056b3',
            textColorsDarkLinkHoverBlue: '#003366',

            textColorsSpanLightBlue: '#0056b3',
            textColorsSpanDarkBlue: '#003366',

            textColorsPrimaryDarkBlue: '#06192e',
        },
    };

    const currentHue = huePresets[hue];

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    background: {
                        default:
                            mode === 'dark'
                                ? currentHue[`backgroundDefaultDark${capitalize(hue)}`]
                                : currentHue[`backgroundDefaultLight${capitalize(hue)}`],
                        paper:
                            mode === 'dark'
                                ? currentHue[`backgroundPaperDark${capitalize(hue)}`]
                                : currentHue[`backgroundPaperLight${capitalize(hue)}`],
                    },
                    text: {
                        primary:
                            mode === 'dark'
                                ? currentHue[`textPrimaryDark${capitalize(hue)}`]
                                : currentHue[`textPrimaryLight${capitalize(hue)}`],
                        secondary: mode === 'dark' ? '#d3a3a3' : '#c08888',
                    },
                    primary: {
                        main:
                            mode === 'dark'
                                ? currentHue[`primaryMainDark${capitalize(hue)}`]
                                : currentHue[`primaryMainLight${capitalize(hue)}`],
                    },
                    textColors: {
                        span:
                            mode === 'dark'
                                ? currentHue[`textColorsSpanDark${capitalize(hue)}`]
                                : currentHue[`textColorsSpanLight${capitalize(hue)}`],
                        util: mode === 'dark' ? '#d3a3a3' : '#c08888',
                        link:
                            mode === 'dark'
                                ? currentHue[`textColorsDarkLink${capitalize(hue)}`]
                                : currentHue[`textColorsLightLink${capitalize(hue)}`],

                        linkHover:
                            mode === 'dark'
                                ? currentHue[`textColorsDarkLinkHover${capitalize(hue)}`]
                                : currentHue[`textColorsLightLinkHover${capitalize(hue)}`],
                        primaryDark:
                            currentHue[`textColorsPrimaryDark${capitalize(hue)}`],
                        primary:
                            mode === 'dark'
                                ? currentHue[`primaryMainDark${capitalize(hue)}`]
                                : currentHue[`primaryMainLight${capitalize(hue)}`],
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
        [mode, hue]
    );

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <GlobalStyles
                    styles={{
                        a: {
                            color: theme.palette.textColors.link,
                            fontWeight: 'bold',
                            textDecoration: 'none',
                            transition: 'color 1s ease',
                            '&:hover': {
                                textDecoration: 'none',
                                color: theme.palette.textColors.linkHover,
                            },
                        },
                        i: {
                            transition: 'color 0.3s ease',
                            color: theme.palette.text.primary,
                        },
                        svg: {
                            transition: 'color 0.3s ease',
                            color: theme.palette.text.primary,
                        },
                        '.nav-menu li:hover a i': {
                            color: theme.palette.textColors.linkHover,
                        },
                        '.nav-menu li:hover a svg': {
                            color: theme.palette.textColors.linkHover,
                        },
                    }}
                />
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};

// Capitalizes "red" → "Red" for key lookup
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
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
            backgroundDefaultLightRed: '#fff7f7',  // very light pinkish
            backgroundDefaultDarkRed: '#121212',   // near black
            backgroundPaperLightRed: '#ffe0e0',    // soft pink
            backgroundPaperDarkRed: '#1e0000',     // dark red-black
            primaryMainLightRed: '#ff4848',        // bright red
            primaryMainDarkRed: '#ff8282',         // lighter red
            textPrimaryLightRed: '#4c0000',        // deep red
            textPrimaryDarkRed: '#fff5f5',         // off-white
            textColorsLinkRed: '#cd0a0a',          // bright red link
            textColorsLinkHoverRed: '#750000',     // dark red hover
            textColorsPrimaryDarkRed: '#4e0000',   // very dark red
        },
        yellow: {
            backgroundDefaultLightYellow: '#fffbee',  // pale creamy yellow (similar lightness to red)
            backgroundDefaultDarkYellow: '#0e0c00',   // very dark olive brown (shifted from red black)
            backgroundPaperLightYellow: '#fff2a8',    // pastel yellow paper
            backgroundPaperDarkYellow: '#252200',     // darker mustard yellow
            primaryMainLightYellow: '#ffcc33',        // bright gold yellow
            primaryMainDarkYellow: '#ffdd66',         // lighter gold
            textPrimaryLightYellow: '#4d4400',        // dark olive-yellow text
            textPrimaryDarkYellow: '#fffde3',         // creamy white text
            textColorsLinkYellow: '#d4a000',          // goldenrod link
            textColorsLinkHoverYellow: '#a77b00',     // dark gold hover
            textColorsPrimaryDarkYellow: '#4d3b00',   // dark mustard
        },
        green: {
            backgroundDefaultLightGreen: '#f3fff4',   // pale minty green
            backgroundDefaultDarkGreen: '#0a1a0a',    // very dark forest green
            backgroundPaperLightGreen: '#c8f5c9',     // light pastel green
            backgroundPaperDarkGreen: '#1c321c',      // dark moss green
            primaryMainLightGreen: '#55bb55',         // bright spring green
            primaryMainDarkGreen: '#88cc88',          // lighter green
            textPrimaryLightGreen: '#0a2f0a',         // deep green text
            textPrimaryDarkGreen: '#e8f5e8',          // pale greenish white
            textColorsLinkGreen: '#2e7d32',           // rich green link
            textColorsLinkHoverGreen: '#1b5e20',      // dark green hover
            textColorsPrimaryDarkGreen: '#0d2e0d',    // very dark green
        },
        blue: {
            backgroundDefaultLightBlue: '#f2faff',    // very pale icy blue
            backgroundDefaultDarkBlue: '#0b101a',     // very dark navy blue
            backgroundPaperLightBlue: '#cde1ff',      // pastel sky blue
            backgroundPaperDarkBlue: '#11263b',       // dark slate blue
            primaryMainLightBlue: '#4a90e2',          // bright cerulean blue
            primaryMainDarkBlue: '#7ab0ff',           // lighter blue
            textPrimaryLightBlue: '#021f3a',          // deep navy text
            textPrimaryDarkBlue: '#ddeeff',           // pale blue-white
            textColorsLinkBlue: '#0056b3',            // strong blue link
            textColorsLinkHoverBlue: '#003366',       // dark navy hover
            textColorsPrimaryDarkBlue: '#06192e',     // very dark navy
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
                                ? currentHue[`textColorsLinkHover${capitalize(hue)}`]
                                : currentHue[`textColorsLink${capitalize(hue)}`],
                        util: mode === 'dark' ? '#d3a3a3' : '#c08888',
                        link: currentHue[`textColorsLink${capitalize(hue)}`],
                        linkHover: currentHue[`textColorsLinkHover${capitalize(hue)}`],
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
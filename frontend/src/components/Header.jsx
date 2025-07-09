import React, { useContext, useState } from 'react';
import {
    Drawer,
    IconButton,
    Box,
    Typography,
    useTheme,
    useMediaQuery,
    Divider,
} from '@mui/material';
import {
    Home as HomeIcon,
    Person as PersonIcon,
    Article as ArticleIcon,
    Work as WorkIcon,
    Email as EmailIcon,
    Menu as MenuIcon,
} from '@mui/icons-material';
import ThemeToggle from './util/ThemeToggle';
import { ColorModeContext } from "./util/ThemeContext.jsx";

const navItems = [
    { icon: <HomeIcon />, text: 'Home', href: '#hero', className: 'bx bx-home' },
    { icon: <PersonIcon />, text: 'About', href: '#about', className: 'bx bx-user' },
    { icon: <ArticleIcon />, text: 'Resume', href: '#resume', className: 'bx bx-file-blank' },
    { icon: <WorkIcon />, text: 'Projects', href: '#past-projects', className: 'bx bx-briefcase' },
];

export default function Header({ mobileNavOpen, setMobileNavOpen }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const { toggleColorMode, setHue } = useContext(ColorModeContext);

    const hues = ['red', 'yellow', 'green', 'blue'];
    const [localHueIndex, setLocalHueIndex] = useState(0);

    const handleHueCycle = () => {
        const nextIndex = (localHueIndex + 1) % hues.length;
        setLocalHueIndex(nextIndex);
        setHue(hues[nextIndex]);
    };

    const toggleDrawer = (open) => () => setMobileNavOpen(open);

    const circleButtonStyle = (theme) => ({
        color: theme.palette.text.primary,
        border: `1.5px solid ${theme.palette.text.primary}`,
        borderRadius: '50%',
        width: 36,
        height: 36,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'color 0.3s, border-color 0.3s',
        cursor: 'pointer',
        userSelect: 'none',
    });

    const handleHover = (theme, isEntering) => (e) => {
        e.currentTarget.style.color = isEntering
            ? theme.palette.textColors.link
            : theme.palette.text.primary;

        e.currentTarget.style.borderColor = isEntering
            ? theme.palette.textColors.link
            : theme.palette.text.primary;
    };

    // Updated ThemeChange to toggle mode
    function ThemeChange(e) {
        e.preventDefault();
    }

    // Get current hue's primary main color from theme
    // fallback to theme.palette.primary.main if missing
    const currentHueColor =
        theme.palette.primary?.main || theme.palette.text.primary;

    const ProfileSection = (
        <Box className="profile" sx={{ textAlign: 'center' }}>
            <img src="/img/logo.png" alt="Logo" className="img-fluid rounded-rectangle" />
            <Typography
                variant="h3"
                sx={{ color: theme.palette.text.primary, mt: 1, fontWeight: 600 }}
            >
                Joey
            </Typography>

            <Box
                className="social-links mt-3 text-center"
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 2,
                    mt: 2,
                }}
            >
                {/* Email Button */}
                <a
                    href="#form"
                    style={circleButtonStyle(theme)}
                    onMouseEnter={handleHover(theme, true)}
                    onMouseLeave={handleHover(theme, false)}
                >
                    <EmailIcon />
                </a>

                {/* Theme Toggle Button */}
                <Box
                    onClick={ThemeChange}
                    style={circleButtonStyle(theme)}
                    onMouseEnter={handleHover(theme, true)}
                    onMouseLeave={handleHover(theme, false)}
                    role="button"
                    tabIndex={0}
                >
                    <ThemeToggle />
                </Box>

                {/* Hue Cycle Button */}
                <Box
                    onClick={handleHueCycle}
                    sx={{
                        borderRadius: '50%',
                        width: 36,
                        height: 36,
                        cursor: 'pointer',
                        userSelect: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        // Background is current hue primary color
                        backgroundColor: currentHueColor,
                        border: `1.5px solid ${currentHueColor}`,
                        transition: 'background-color 0.3s, color 0.3s, border-color 0.3s',
                    }}
                    onMouseEnter={handleHover(theme, true)}
                    onMouseLeave={handleHover(theme, false)}
                    role="button"
                    tabIndex={0}
                    title={`Switch Hue: ${hues[(localHueIndex + 1) % hues.length]}`}
                >
                    <Typography
                        sx={{
                            color: theme.palette.mode === 'dark' ? '#000' : '#fff',
                            fontWeight: 'bold',
                            userSelect: 'none',
                        }}
                    >
                        {hues[localHueIndex][0].toUpperCase()}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );

    const NavLinks = (
        <Box component="nav" id="navbar" className={`nav-menu navbar`}>
            <ul>
                {navItems.map(({ icon, text, href, className }) => (
                    <li key={text}>
                        <Typography
                            component="a"
                            href={href}
                            className="nav-link scrollto"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                color: theme.palette.primary.main,
                                fontWeight: 'bold',
                                textDecoration: 'none',
                                transition: 'color 0.3s',
                                '&:hover': {
                                    color: theme.palette.textColors.link,
                                },
                            }}
                            onClick={() => {
                                if (isMobile) setMobileNavOpen(false);
                            }}
                        >
                            <i className={className} style={{ marginRight: 8 }}></i>
                            <Typography
                                component="span"
                                sx={{ color: theme.palette.text.primary, ml: 1 }}
                            >
                                {text}
                            </Typography>
                        </Typography>
                    </li>
                ))}
            </ul>
        </Box>
    );

    if (isMobile) {
        return (
            <>
                <Box
                    component="header"
                    id="header"
                    className="pb-4"
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 1300,
                        bgcolor: theme.palette.background.paper,
                        transition: 'background-color 1s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        px: 2,
                        height: 56,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <img
                            src="/img/logo.png"
                            alt="Logo"
                            style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }}
                        />
                        <Typography
                            variant="h6"
                            component="h1"
                            sx={{ color: theme.palette.primary.main, fontWeight: 600 }}
                        >
                            <a
                                href="#hero"
                                style={{ color: 'inherit', textDecoration: 'none', userSelect: 'none' }}
                            >
                                Joey
                            </a>
                        </Typography>
                    </Box>

                    <IconButton
                        aria-label="menu"
                        onClick={toggleDrawer(true)}
                        sx={{ color: theme.palette.primary.main }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Box>

                <Drawer
                    anchor="left"
                    open={mobileNavOpen}
                    onClose={toggleDrawer(false)}
                    ModalProps={{ keepMounted: true }}
                    PaperProps={{
                        sx: {
                            width: 280,
                            bgcolor: theme.palette.background.default,
                            color: theme.palette.text.primary,
                            transition: 'background-color 1s ease',
                            pt: 4,
                        },
                    }}
                >
                    {ProfileSection}
                    <Divider sx={{ my: 2 }} />
                    {NavLinks}
                </Drawer>

                <Box sx={{ height: 56 }} />
            </>
        );
    }

    return (
        <Box
            component="aside"
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: 280,
                height: '100vh',
                bgcolor: theme.palette.background.paper,
                transition: 'background-color 1s ease',
                borderRight: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                py: 4,
                px: 2,
                overflowY: 'auto',
                zIndex: 1200,
            }}
            className="pb-4"
        >
            {ProfileSection}
            <Divider sx={{ width: '100%', mt: 2, borderBottomWidth: '3px' }} />
            {NavLinks}
        </Box>
    );
}
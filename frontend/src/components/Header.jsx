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
    Settings as SettingsIcon,
    AdminPanelSettings as AdminIcon, // Added for Admin access
} from '@mui/icons-material';
import ThemeToggle from './button/toggle/ThemeToggle.jsx';
import { ColorModeContext } from "./util/ThemeContext.jsx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./login/AuthContext.jsx";

const navItems = [
    { icon: <HomeIcon />, text: 'Home', href: '#hero', className: 'bx bx-home' },
    { icon: <PersonIcon />, text: 'About', href: '#about', className: 'bx bx-user' },
    { icon: <ArticleIcon />, text: 'Resume', href: '#resume', className: 'bx bx-file-blank' },
    { icon: <WorkIcon />, text: 'Projects', href: '#past-projects', className: 'bx bx-briefcase' },
];

export default function Header({ mobileNavOpen, setMobileNavOpen }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();

    const { user } = useAuth();
    const { setHue } = useContext(ColorModeContext);

    const hues = ['red', 'yellow', 'green', 'blue'];
    const [localHueIndex, setLocalHueIndex] = useState(0);

    // Build dynamic navigation items based on role
    const currentNavItems = [...navItems];
    const isAdmin = user?.role.rank <= 1;

    if (isAdmin) {
        currentNavItems.push({
            icon: <AdminIcon />,
            text: 'Admin Panel',
            href: '/admin',
            className: 'bx bx-shield-quarter',
            isRoute: true // Flag to use navigate() instead of anchor scroll
        });
    }

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
        textDecoration: 'none'
    });

    const handleHover = (theme, isEntering) => (e) => {
        e.currentTarget.style.color = isEntering
            ? theme.palette.textColors.link
            : theme.palette.text.primary;

        e.currentTarget.style.borderColor = isEntering
            ? theme.palette.textColors.link
            : theme.palette.text.primary;
    };

    const goToAuth = () => {
        navigate(user ? "/account" : "/auth");
    };

    const currentHueColor =
        theme.palette.primary?.main || theme.palette.text.primary;

    const ProfileSection = (
        <Box className="profile" sx={{ textAlign: 'center' }}>
            <Typography
                variant="h3"
                sx={{ color: theme.palette.text.primary, mt: 1, fontWeight: 600 }}
            >
                {user ? user.username : "James"}
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
                <a
                    href="mailto:me@joeyfox.dev"
                    style={circleButtonStyle(theme)}
                    onMouseEnter={handleHover(theme, true)}
                    onMouseLeave={handleHover(theme, false)}
                >
                    <EmailIcon />
                </a>
                <Box
                    onClick={(e) => e.preventDefault()}
                    style={circleButtonStyle(theme)}
                    onMouseEnter={handleHover(theme, true)}
                    onMouseLeave={handleHover(theme, false)}
                    role="button"
                    tabIndex={0}
                >
                    <ThemeToggle />
                </Box>

                <Box
                    onClick={goToAuth}
                    style={circleButtonStyle(theme)}
                    onMouseEnter={handleHover(theme, true)}
                    onMouseLeave={handleHover(theme, false)}
                    role="button"
                    tabIndex={0}
                    title={user ? "My Account" : "Login"}
                >
                    {user ? <SettingsIcon/> : <PersonIcon/>}
                </Box>

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
                        backgroundColor: currentHueColor,
                        border: `1.5px solid ${currentHueColor}`,
                        transition: 'background-color 0.3s, color 0.3s, border-color 0.3s',
                    }}
                    onMouseEnter={handleHover(theme, true)}
                    onMouseLeave={handleHover(theme, false)}
                    role="button"
                    tabIndex={0}
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
                {currentNavItems.map(({text, href, className, isRoute }) => (
                    <li key={text}>
                        <Typography
                            component="a"
                            href={isRoute ? undefined : href}
                            className="nav-link scrollto"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                color: theme.palette.primary.main,
                                fontWeight: 'bold',
                                textDecoration: 'none',
                                transition: 'color 0.3s',
                                cursor: 'pointer',
                                '&:hover': {
                                    color: theme.palette.textColors.link,
                                },
                            }}
                            onClick={(e) => {
                                if (isRoute) {
                                    e.preventDefault();
                                    navigate(href);
                                }
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

    return (
        <>
            {isMobile ? (
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
                                    {user ? user.username : "James"}
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
                </>
            ) : (
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
                >
                    {ProfileSection}
                    <Divider sx={{ width: '100%', mt: 2, borderBottomWidth: '3px' }} />
                    {NavLinks}
                </Box>
            )}
        </>
    );
}
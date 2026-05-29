import React, { useState } from 'react';
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Divider,
    Paper,
    IconButton
} from '@mui/material';
import {
    People as PeopleIcon,
    Dashboard as DashIcon,
    Security as SecurityIcon,
    Menu as MenuIcon
} from '@mui/icons-material';
import UserManagement from './UserManagement';
import { useAuth } from '../login/AuthContext.jsx';
import BackButton from "../button/BackButton.jsx";

const DRAWER_WIDTH = 260;

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user } = useAuth();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const menuItems = [
        { label: 'User Management', icon: <PeopleIcon />, index: 0 },
        { label: 'System Stats', icon: <DashIcon />, index: 1 },
        { label: 'Security Logs', icon: <SecurityIcon />, index: 2 },
    ];

    // Extracted the menu list into a reusable variable to feed both desktop and mobile drawers
    const drawerContent = (
        <>
            {/* Sidebar Top Header */}
            <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Admin Portal
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                    Logged in: {user?.username}
                </Typography>
            </Box>

            <Divider sx={{ borderColor: 'divider' }} />

            {/* Navigation Links */}
            <List sx={{ px: 1.5, py: 2 }}>
                {menuItems.map((item) => {
                    const isSelected = activeTab === item.index;
                    return (
                        <ListItem key={item.index} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                onClick={() => {
                                    setActiveTab(item.index);
                                    setMobileOpen(false); // Auto-close menu drawer when an item is selected on mobile
                                }}
                                selected={isSelected}
                                sx={{
                                    borderRadius: 2,
                                    '&.Mui-selected': {
                                        bgcolor: (theme) => `${theme.palette.primary.main}26`,
                                        color: 'primary.main',
                                        '&:hover': {
                                            bgcolor: (theme) => `${theme.palette.primary.main}40`
                                        },
                                        '& .MuiListItemIcon-root': {
                                            color: 'primary.main'
                                        }
                                    },
                                    '&:hover': {
                                        bgcolor: 'action.hover',
                                    }
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 40,
                                        color: isSelected ? 'primary.main' : 'text.secondary',
                                        transition: 'color 0.3s ease'
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        fontSize: '0.9rem',
                                        fontWeight: isSelected ? 600 : 500
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </>
    );

    return (
        <Box
            sx={{
                display: 'flex',
                minHeight: '100vh',
                bgcolor: 'background.default',
                color: 'text.primary',
                transition: 'background-color 1s ease, color 1s ease'
            }}
        >
            {/* --- MOBILE TEMPORARY DRAWER --- */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Improves performance when rendering on mobile devices.
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        width: DRAWER_WIDTH,
                        boxSizing: 'border-box',
                        bgcolor: 'background.paper',
                        color: 'text.primary',
                        transition: 'background-color 1s ease',
                        backgroundImage: 'none' // Fixes weird elevation tints in dark mode
                    },
                }}
            >
                {drawerContent}
            </Drawer>

            {/* --- DESKTOP PERMANENT DRAWER --- */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', md: 'block' },
                    width: DRAWER_WIDTH,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: DRAWER_WIDTH,
                        boxSizing: 'border-box',
                        borderRight: '1px solid',
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                        color: 'text.primary',
                        transition: 'background-color 1s ease, border-color 1s ease',
                    },
                }}
            >
                {drawerContent}
            </Drawer>

            {/* --- MAIN CONTENT CONTAINER --- */}
            <Box
                sx={{
                    flexGrow: 1,
                    p: { xs: 2, sm: 3, md: 4 }, // Fluid padding reduces footprint on small viewports
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    maxWidth: '100%',
                    overflowX: 'hidden'
                }}
            >
                {/* Top Action Ribbon */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>

                        {/* Hamburger Button visible only on mobile (below md breakpoint) */}
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 0.5, display: { md: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>

                        <BackButton to="/" />
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 'bold',
                                fontSize: { xs: '1.2rem', sm: '1.5rem' } // Scaled font down slightly on small phones
                            }}
                        >
                            {menuItems[activeTab].label}
                        </Typography>
                    </Box>

                    {/* Hides metadata tags entirely on narrow viewports to avoid overlapping titles */}
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            display: { xs: 'none', lg: 'block' },
                            textAlign: 'right'
                        }}
                    >
                        {user?.role?.role} • {user?.role?.description}
                    </Typography>
                </Box>

                {/* Content Workspace Frame */}
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 2, sm: 3 }, // Compact internal spacing on mobile layout
                        borderRadius: 3,
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        minHeight: '70vh',
                        color: 'text.primary',
                        transition: 'background-color 1s ease, border-color 1s ease',
                        overflowX: 'auto' // Prevents wide user tables from breaking layout
                    }}
                >
                    {activeTab === 0 && <UserManagement currentUser={user} />}
                    {activeTab === 1 && <Typography color="text.secondary">Server stats coming soon...</Typography>}
                    {activeTab === 2 && <Typography color="text.secondary">Audit logs coming soon...</Typography>}
                </Paper>
            </Box>
        </Box>
    );
};

export default AdminPanel;
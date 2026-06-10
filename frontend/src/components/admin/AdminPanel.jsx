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
import SharedFilesManager from "./SharedFIleManager.jsx";

const DRAWER_WIDTH = 260;

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user } = useAuth();
    const userRank = user?.role?.rank ?? 99; // Fallback to safe high number if undefined

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    // 1. Centralize requirements by attaching requiredRank directly to each menu structure
    const menuItems = [
        { label: 'User Management', icon: <PeopleIcon />, index: 0, requiredRank: 1 }, // Admin Only
        { label: 'FTP File Transfer', icon: <DashIcon />, index: 1, requiredRank: 4 },  // Trusted + Admin
    ];

    const drawerContent = (
        <>
            <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Admin Portal
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                    Logged in: {user?.username}
                </Typography>
            </Box>

            <Divider sx={{ borderColor: 'divider' }} />

            <List sx={{ px: 1.5, py: 2 }}>
                {menuItems.map((item) => {
                    const isSelected = activeTab === item.index;

                    // 2. Evaluate if the current logged-in user possesses the access rank required
                    const hasAccess = userRank <= item.requiredRank;

                    return (
                        <ListItem key={item.index} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                // 3. MUI's native disabled property automatically handles gray styling & disables clicks
                                disabled={!hasAccess}
                                onClick={() => {
                                    setActiveTab(item.index);
                                    setMobileOpen(false);
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

    // 4. Secondary Guard: Extract permission check for whatever tab is currently active
    const activeItem = menuItems.find(item => item.index === activeTab);
    const canViewActiveTab = activeItem ? userRank <= activeItem.requiredRank : false;

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
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        width: DRAWER_WIDTH,
                        boxSizing: 'border-box',
                        bgcolor: 'background.paper',
                        color: 'text.primary',
                        transition: 'background-color 1s ease',
                        backgroundImage: 'none'
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
                    p: { xs: 2, sm: 3, md: 4 },
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
                            sx={{ fontWeight: 'bold', fontSize: { xs: '1.2rem', sm: '1.5rem' } }}
                        >
                            {activeItem?.label || "Admin Panel"}
                        </Typography>
                    </Box>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ display: { xs: 'none', lg: 'block' }, textAlign: 'right' }}
                    >
                        {user?.role?.role} • {user?.role?.description}
                    </Typography>
                </Box>

                {/* Content Workspace Frame */}
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 2, sm: 3 },
                        borderRadius: 3,
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        minHeight: '70vh',
                        color: 'text.primary',
                        transition: 'background-color 1s ease, border-color 1s ease',
                        overflowX: 'auto'
                    }}
                >
                    {/* 5. Check if they have access to the current active tab state. If false, block render */}
                    {!canViewActiveTab ? (
                        <Typography color="error">
                            You do not have permission to view this section.
                        </Typography>
                    ) : (
                        <>
                            {activeTab === 0 && <UserManagement currentUser={user} />}
                            {activeTab === 1 && <SharedFilesManager currentUser={user} />}
                            {activeTab === 2 && <Typography color="text.secondary">Audit logs coming soon...</Typography>}
                        </>
                    )}
                </Paper>
            </Box>
        </Box>
    );
};

export default AdminPanel;
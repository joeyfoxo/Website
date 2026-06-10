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
    IconButton,
    useTheme,
    Stack
} from '@mui/material';
import {
    People as PeopleIcon,
    Dashboard as DashIcon,
    Menu as MenuIcon
} from '@mui/icons-material';
import UserManagement from './UserManagement';
import { useAuth } from '../login/AuthContext.jsx';
import BackButton from "../button/BackButton.jsx";
import SharedFilesManager from "./SharedFIleManager.jsx";
import LogoutButton from "../button/LogoutButton.jsx";

const DRAWER_WIDTH = 260;

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user } = useAuth();
    const userRank = user?.role?.rank ?? 99;
    useTheme();
    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    const menuItems = [
        { label: 'User Management', icon: <PeopleIcon />, index: 0, requiredRank: 1 },
        { label: 'FTP File Transfer', icon: <DashIcon />, index: 1, requiredRank: 4 },
    ];

    const drawerContent = (
        <>
            <Box sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Control Panel
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {user?.username}
                </Typography>
            </Box>
            <Divider />
            <List sx={{ px: 1.5 }}>
                {menuItems.map((item) => {
                    const isSelected = activeTab === item.index;
                    return (
                        <ListItem key={item.index} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                disabled={userRank > item.requiredRank}
                                onClick={() => { setActiveTab(item.index); setMobileOpen(false); }}
                                selected={isSelected}
                                sx={{ borderRadius: 2 }}
                            >
                                <ListItemIcon sx={{ minWidth: 40, color: isSelected ? 'primary.main' : 'inherit' }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: isSelected ? 600 : 500 }} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </>
    );

    const activeItem = menuItems.find(item => item.index === activeTab);
    const canViewActiveTab = activeItem ? userRank <= activeItem.requiredRank : false;

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}
            >
                {drawerContent}
            </Drawer>
            <Drawer
                variant="permanent"
                sx={{ display: { xs: 'none', md: 'block' }, width: DRAWER_WIDTH, flexShrink: 0 }}
            >
                {drawerContent}
            </Drawer>

            <Box sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Improved Header Layout */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <IconButton onClick={handleDrawerToggle} sx={{ display: { md: 'none' } }}>
                            <MenuIcon />
                        </IconButton>
                        <BackButton to="/" />
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                            {activeItem?.label || "Control Panel"}
                        </Typography>
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={2} sx={{ flexShrink: 0 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', lg: 'block' } }}>
                            {user?.role?.role}
                        </Typography>
                            <LogoutButton />
                    </Stack>
                </Box>

                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', minHeight: '70vh' }}>
                    {!canViewActiveTab ? (
                        <Typography color="error">Permission denied.</Typography>
                    ) : (
                        <>
                            {activeTab === 0 && <UserManagement currentUser={user} />}
                            {activeTab === 1 && <SharedFilesManager currentUser={user} />}
                        </>
                    )}
                </Paper>
            </Box>
        </Box>
    );
};

export default AdminPanel;
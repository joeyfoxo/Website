import React, { useState } from 'react';
import { Box, Tabs, Tab, Paper, Typography, Divider } from '@mui/material';
import { People as PeopleIcon, Dashboard as DashIcon, Security as SecurityIcon } from '@mui/icons-material';
import UserManagement from './UserManagement';
import { useAuth } from '../login/AuthContext.jsx'; // Adjust path if needed

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState(0);

    // 1. Pull out 'user' directly. No more confusing aliases!
    const { user } = useAuth();

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    // 2. Updated access check to use 'user'
    const hasAccess = user?.role === 'ADMIN' || user?.role === 'JOEY';
    if (!hasAccess) {
        return (
            <Box sx={{ p: 4 }}>
                <Typography color="error">Access Denied</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 4 }}>
            <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    System Administration
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {/* 3. Updated display names */}
                    Logged in as: {user.username} ({user.role})
                </Typography>
            </Box>

            <Paper elevation={2}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                >
                    <Tab icon={<PeopleIcon />} label="User Management" />
                    <Tab icon={<DashIcon />} label="System Stats" />
                    <Tab icon={<SecurityIcon />} label="Security Logs" />
                </Tabs>

                <Divider />

                <Box sx={{ p: 2 }}>
                    {/* 4. Pass 'user' down to UserManagement component */}
                    {activeTab === 0 && <UserManagement currentUser={user} />}
                    {activeTab === 1 && <Typography sx={{ p: 4 }}>Server stats coming soon...</Typography>}
                    {activeTab === 2 && <Typography sx={{ p: 4 }}>Audit logs coming soon...</Typography>}
                </Box>
            </Paper>
        </Box>
    );
};

export default AdminPanel;
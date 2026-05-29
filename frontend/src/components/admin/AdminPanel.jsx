import React, { useState } from 'react';
import { Box, Tabs, Tab, Paper, Typography, Divider } from '@mui/material';
import { People as PeopleIcon, Dashboard as DashIcon, Security as SecurityIcon } from '@mui/icons-material';
import UserManagement from './UserManagement';
import { useAuth } from '../login/AuthContext.jsx';
import BackButton from "../button/BackButton.jsx"; // Adjust path if needed

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
            {/* Header Container set to relative positioning */}
            <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 64 }}>

                {/* Absolutely positioned back button on the far left */}
                <Box sx={{ position: 'absolute', left: 0 }}>
                    <BackButton to="/" />
                </Box>

                {/* Center-aligned Title Block */}
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        System Administration
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Logged in as: {user.username} ({user.role})
                    </Typography>
                </Box>
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
                    {activeTab === 0 && <UserManagement currentUser={user} />}
                    {activeTab === 1 && <Typography sx={{ p: 4 }}>Server stats coming soon...</Typography>}
                    {activeTab === 2 && <Typography sx={{ p: 4 }}>Audit logs coming soon...</Typography>}
                </Box>
            </Paper>
        </Box>
    );
};

export default AdminPanel;
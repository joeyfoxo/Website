import React, { useState } from 'react';
import { Box, Tabs, Tab, Paper, Typography, Divider } from '@mui/material';
import { People as PeopleIcon, Dashboard as DashIcon, Security as SecurityIcon } from '@mui/icons-material';
import UserManagement from './UserManagement';

const AdminPanel = ({ currentUser }) => {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    // Access check at the entry point
    const hasAccess = currentUser?.role === 'ADMIN' || currentUser?.role === 'JOEY';
    if (!hasAccess) return <Box sx={{ p: 4 }}><Typography color="error">Access Denied</Typography></Box>;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 4 }}>
            <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    System Administration
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Logged in as: {currentUser.username} ({currentUser.role})
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
                    {activeTab === 0 && <UserManagement currentUser={currentUser} />}
                    {activeTab === 1 && <Typography sx={{ p: 4 }}>Server stats coming soon...</Typography>}
                    {activeTab === 2 && <Typography sx={{ p: 4 }}>Audit logs coming soon...</Typography>}
                </Box>
            </Paper>
        </Box>
    );
};

export default AdminPanel;
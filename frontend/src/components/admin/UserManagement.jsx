import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Select, MenuItem, Typography, Box, Alert, CircularProgress, Chip
} from '@mui/material';
import { fetchAllUsers, updateUserRole } from '../api';

const UserManagement = ({ currentUser }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const hasAccess = currentUser?.role === 'ADMIN' || currentUser?.role === 'JOEY';

    const loadUsers = async () => {
        try {
            const data = await fetchAllUsers();
            setUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (hasAccess) loadUsers();
    }, [hasAccess]);

    const handleRoleChange = async (email, newRole) => {
        try {
            await updateUserRole(email, newRole);
            loadUsers();
        } catch (err) {
            setError("Failed to update role: " + err.message);
        }
    };

    if (!hasAccess) return <Alert severity="error">Access Denied: Administrative privileges required.</Alert>;

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                User Management
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TableContainer component={Paper} elevation={3}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell><strong>Username</strong></TableCell>
                            <TableCell><strong>Email</strong></TableCell>
                            <TableCell><strong>Status</strong></TableCell>
                            <TableCell align="right"><strong>Role Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={4} align="center"><CircularProgress /></TableCell></TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user.email} hover>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={user.role}
                                            color={user.role === 'JOEY' || user.role === 'ADMIN' ? 'primary' : 'default'}
                                            variant="outlined"
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Select
                                            value={user.role}
                                            size="small"
                                            disabled={user.email === currentUser.email}
                                            onChange={(e) => handleRoleChange(user.email, e.target.value)}
                                            sx={{ minWidth: 150 }}
                                        >
                                            <MenuItem value="USER">USER</MenuItem>
                                            <MenuItem value="AUTHENTICATED">AUTHENTICATED</MenuItem>
                                            <MenuItem value="ADMIN">ADMIN</MenuItem>
                                            <MenuItem value="JOEY">JOEY</MenuItem>
                                            <MenuItem value="BOT">BOT</MenuItem>
                                        </Select>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default UserManagement;
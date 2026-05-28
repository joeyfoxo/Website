import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Select, MenuItem, Alert, CircularProgress, Chip, Box, Typography
} from '@mui/material';
import { fetchAllUsers, updateUserRole } from '../api/api.js';

const UserManagement = ({ currentUser }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

    useEffect(() => { loadUsers(); }, []);

    const handleRoleChange = async (email, newRole) => {
        try {
            await updateUserRole(email, newRole);
            loadUsers();
        } catch (err) {
            setError("Update failed: " + err.message);
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;

    return (
        <Box>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>User</TableCell>
                            <TableCell>Role Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.email} hover>
                                <TableCell>
                                    <Typography variant="body1">{user.username}</Typography>
                                    <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={user.role}
                                        color={user.role === 'JOEY' ? 'secondary' : 'primary'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <Select
                                        value={user.role}
                                        size="small"
                                        disabled={user.email === currentUser.email}
                                        onChange={(e) => handleRoleChange(user.email, e.target.value)}
                                    >
                                        <MenuItem value="USER">USER</MenuItem>
                                        <MenuItem value="ADMIN">ADMIN</MenuItem>
                                        <MenuItem value="JOEY">JOEY</MenuItem>
                                    </Select>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default UserManagement;
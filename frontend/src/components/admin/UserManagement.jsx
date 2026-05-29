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
        // Max-width constrains the overall size, centering it nicely inside your AdminPanel layout
        <Box sx={{ maxWidth: 900, margin: '0 auto', p: 1 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TableContainer>
                {/* tableLayout: 'fixed' forces columns to respect their set widths strictly */}
                <Table sx={{ tableLayout: 'fixed' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ width: '45%' }}>User</TableCell>
                            <TableCell sx={{ width: '30%' }}>Role Status</TableCell>
                            <TableCell sx={{ width: '25%' }} align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.email} hover>
                                <TableCell sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                        {user.username}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        {user.email}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    {/* Wrapping Chip in a Box guarantees it anchors inside fixed layouts cleanly */}
                                    <Box sx={{ minWidth: 130, display: 'inline-block' }}>
                                        <Chip
                                            label={user.role.role}
                                            color={user.role.rank === 0 ? 'secondary' : 'primary'}
                                            size="small"
                                        />
                                    </Box>
                                </TableCell>
                                {/* Fixed layout bug: Removed duplicate nested TableCell tags */}
                                <TableCell align="right">
                                    <Select
                                        value={user.role.role}
                                        size="small"
                                        fullWidth // Spans the full 25% boundary allocated to this column nicely
                                        disabled={user.email === currentUser?.email}
                                        onChange={(e) => handleRoleChange(user.email, e.target.value)}
                                        sx={{ minWidth: 120 }}
                                    >
                                        <MenuItem value="AUTHENTICATED">AUTHENTICATED</MenuItem>
                                        <MenuItem value="TRUSTED">TRUSTED</MenuItem>
                                        <MenuItem value="DEV">DEV</MenuItem>
                                        <MenuItem value="BOT">BOT</MenuItem>
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
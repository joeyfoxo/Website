import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Select, MenuItem, Alert, CircularProgress, Chip, Box, Typography, IconButton,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Tooltip
} from '@mui/material';
import { fetchAllUsers, updateUserRole, deleteProfile } from '../api/api.js';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import UndoIcon from '@mui/icons-material/Undo';

const UserManagement = ({ currentUser }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [pendingRoles, setPendingRoles] = useState({});
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

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

    const handleRoleChange = (email, newRole) => {
        setPendingRoles(prev => ({ ...prev, [email]: newRole }));
    };

    const handleUndoChange = (email) => {
        setPendingRoles(prev => {
            const updated = { ...prev };
            delete updated[email];
            return updated;
        });
    };

    const handleSaveRole = async (email) => {
        const targetRole = pendingRoles[email];
        if (!targetRole) return;

        setLoading(true);
        setError(null);
        try {
            await updateUserRole(email, targetRole);
            handleUndoChange(email);
            await loadUsers();
        } catch (err) {
            setError("Update failed: " + err.message);
            setLoading(false);
        }
    };

    const openDeletePrompt = (email) => {
        setUserToDelete(email);
        setDeleteDialogOpen(true);
    };

    const closeDeletePrompt = () => {
        setUserToDelete(null);
        setDeleteDialogOpen(false);
    };

    const confirmDeleteUser = async () => {
        if (!userToDelete) return;
        setLoading(true);
        setError(null);
        try {
            await deleteProfile(userToDelete);
            handleUndoChange(userToDelete);
            await loadUsers();
        } catch (err) {
            setError(`Failed to delete user ${userToDelete}: ${err.message}`);
        } finally {
            setLoading(false);
            closeDeletePrompt();
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;

    return (
        <Box sx={{ maxWidth: 1000, margin: '24px auto', p: 2 }}>
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <TableContainer sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', bgcolor: 'background.paper' }}>
                <Table sx={{ tableLayout: 'fixed' }}>
                    <TableHead sx={{ bgcolor: 'action.hover' }}>
                        <TableRow>
                            <TableCell sx={{ width: '35%', fontWeight: 600 }}>User</TableCell>
                            <TableCell sx={{ width: '20%', fontWeight: 600 }}>Current Role</TableCell>
                            <TableCell sx={{ width: '25%', fontWeight: 600 }}>Assign New Role</TableCell>
                            <TableCell sx={{ width: '20%', fontWeight: 600 }} align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => {
                            const stagedRole = pendingRoles[user.email];
                            const currentRoleValue = stagedRole !== undefined ? stagedRole : user.role.role;
                            const isRoleChanged = stagedRole !== undefined && stagedRole !== user.role.role;
                            const isSelf = user.email === currentUser?.email;

                            return (
                                <TableRow
                                    key={user.email}
                                    hover
                                    sx={{
                                        // Soft blue tint to highlight rows with unsaved changes
                                        bgcolor: isRoleChanged ? 'action.selected' : 'inherit',
                                        transition: 'background-color 0.2s ease'
                                    }}
                                >
                                    {/* USER INFO */}
                                    <TableCell sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            {user.username}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            {user.email}
                                        </Typography>
                                    </TableCell>

                                    {/* CURRENT CHIP STATUS */}
                                    <TableCell>
                                        <Chip
                                            label={user.role.role}
                                            color={user.role.rank === 0 ? 'secondary' : 'primary'}
                                            variant={isRoleChanged ? 'outlined' : 'filled'}
                                            size="small"
                                        />
                                    </TableCell>

                                    {/* ROLE SELECT dropdown */}
                                    <TableCell>
                                        <Select
                                            value={currentRoleValue}
                                            size="small"
                                            fullWidth
                                            disabled={isSelf}
                                            onChange={(e) => handleRoleChange(user.email, e.target.value)}
                                            variant='outlined'
                                            sx={{
                                                borderRadius: 1.5,
                                                borderColor: isRoleChanged ? 'primary.main' : 'default'
                                            }}
                                        >
                                            <MenuItem value="AUTHENTICATED">AUTHENTICATED</MenuItem>
                                            <MenuItem value="TRUSTED">TRUSTED</MenuItem>
                                            <MenuItem value="DEV">DEV</MenuItem>
                                            <MenuItem value="BOT">BOT</MenuItem>
                                            <MenuItem value="ADMIN">ADMIN</MenuItem>
                                            <MenuItem value="JOEY">JOEY</MenuItem>
                                        </Select>
                                    </TableCell>

                                    {/* ACTIONS BUTTONS */}
                                    <TableCell align="right">
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5, minHeight: 40 }}>
                                            {isRoleChanged && (
                                                <>
                                                    <Tooltip title="Save Changes">
                                                        <IconButton onClick={() => handleSaveRole(user.email)} color="primary" size="small">
                                                            <SaveIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Undo">
                                                        <IconButton onClick={() => handleUndoChange(user.email)} color="default" size="small">
                                                            <UndoIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </>
                                            )}

                                            <Tooltip title={isSelf ? "You cannot delete yourself" : "Delete User"}>
                                                <span>
                                                    <IconButton
                                                        onClick={() => openDeletePrompt(user.email)}
                                                        disabled={isSelf}
                                                        color="error"
                                                        size="small"
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </span>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Delete Confirmation Modal */}
            <Dialog open={deleteDialogOpen} onClose={closeDeletePrompt}>
                <DialogTitle>Confirm User Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to permanently delete the profile for <strong>{userToDelete}</strong>? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={closeDeletePrompt} color="inherit">Cancel</Button>
                    <Button onClick={confirmDeleteUser} color="error" variant="contained">Delete User</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UserManagement;
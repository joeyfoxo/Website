import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

const NewFolderDialog = ({ open, onClose, onConfirm }) => {
    const [folderName, setFolderName] = useState("");

    // Reset input buffer when the modal shifts visibility status
    useEffect(() => {
        if (!open) setFolderName("");
    }, [open]);

    const handleSubmit = () => {
        if (!folderName.trim()) return;
        onConfirm(folderName.trim());
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Folder Name"
                    type="text"
                    fullWidth
                    size="small"
                    variant="outlined"
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    sx={{ mt: 1, minWidth: 300 }}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} color="success" variant="contained">
                    Create Folder
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default NewFolderDialog;
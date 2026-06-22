import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

const ShareDialog = ({ open, onClose, onConfirm, fileToShare }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle>Generate Public Link</DialogTitle>
            <DialogContent>
                <Typography variant="body2" color="text.secondary">
                    Are you sure you want to expose <strong>{fileToShare?.displayName}</strong> via a public download link? Anyone with access to the link will bypass sandbox authentication rules for the next 24 hours.
                </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} color="inherit">
                    Cancel
                </Button>
                <Button
                    onClick={onConfirm}
                    color="success"
                    variant="contained"
                    autoFocus
                >
                    Confirm Share
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ShareDialog;
import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, Button, Paper, LinearProgress, Alert, Stack,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton
} from '@mui/material';
import {
    CloudUpload as UploadIcon, InsertDriveFile as FileIcon,
    Download as DownloadIcon, Refresh as RefreshIcon, Close as CloseIcon
} from '@mui/icons-material';
import { uploadFile, fetchFiles, downloadFile } from '../api/api.js'; // Match your file structure path

const SharedFilesManager = () => {
    const [files, setFiles] = useState([]);
    const [stagedFile, setStagedFile] = useState(null);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isDragActive, setIsDragActive] = useState(false);

    const loadFilesList = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await fetchFiles();
            setFiles(data || []);
        } catch (error) {
            setStatus({ type: 'error', message: error.message || "Failed to load directory files." });
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadFilesList();
    }, [loadFilesList]);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(e.type === "dragenter" || e.type === "dragover");
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setStagedFile(e.dataTransfer.files[0]);
            setStatus({ type: '', message: '' });
        }
    }, []);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setStagedFile(e.target.files[0]);
            setStatus({ type: '', message: '' });
        }
    };

    const handleUpload = async () => {
        if (!stagedFile) return;
        setIsUploading(true);
        setStatus({ type: '', message: '' });

        try {
            await uploadFile(stagedFile);
            setStatus({ type: 'success', message: "File securely deposited." });
            setStagedFile(null);
            await loadFilesList();
        } catch (error) {
            setStatus({ type: 'error', message: error.message || "Upload failed." });
        } finally {
            setIsUploading(false);
        }
    };

    const handleDownload = async (fullName, displayName) => {
        try {
            await downloadFile(fullName, displayName);
        } catch (error) {
            setStatus({ type: 'error', message: error.message || "Download failed." });
        }
    };

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <Box sx={{ py: 1 }}>
            <Stack gap={4}>
                {/* Header Context Controls */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                            Shared Storage File Explorer
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Deposit, browse, and securely download assets inside your current operational tier level.
                        </Typography>
                    </Box>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={loadFilesList}
                        disabled={isLoading || isUploading}
                        sx={{ borderRadius: 2, whiteSpace: 'nowrap' }}
                    >
                        Refresh List
                    </Button>
                </Box>

                {status.message && (
                    <Alert
                        severity={status.type}
                        variant="outlined"
                        sx={{ borderRadius: 2 }}
                        onClose={() => setStatus({ type: '', message: '' })}
                    >
                        {status.message}s
                    </Alert>
                )}

                {/* Upload Section Box */}
                <Paper
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    elevation={0}
                    sx={{
                        p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        borderRadius: 3, border: '2px dashed', borderColor: isDragActive ? 'primary.main' : 'divider',
                        bgcolor: isDragActive ? (theme) => `${theme.palette.primary.main}08` : 'background.default',
                        transition: 'all 0.2s ease', minHeight: 140
                    }}
                >
                    <input
                        type="file"
                        id="file-upload-input"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                        disabled={isUploading}
                    />
                    <UploadIcon sx={{ fontSize: 40, color: isDragActive ? 'primary.main' : 'text.secondary', mb: 1 }} />
                    <Typography variant="body2" textAlign="center" sx={{ fontWeight: 500 }}>
                        Drag files here or{' '}
                        <label htmlFor="file-upload-input" style={{ color: '#2196f3', cursor: 'pointer', textDecoration: 'underline' }}>
                            browse
                        </label>
                    </Typography>
                </Paper>

                {/* File Staging Box */}
                {stagedFile && (
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <FileIcon color="primary" />
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                            <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>{stagedFile.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{formatBytes(stagedFile.size)}</Typography>
                        </Box>
                        <Stack direction="row" gap={1}>
                            <IconButton
                                size="small"
                                color="error"
                                onClick={() => setStagedFile(null)}
                                disabled={isUploading}
                                title="Cancel staging"
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                            <Button
                                variant="contained"
                                onClick={handleUpload}
                                disabled={isUploading}
                                sx={{ borderRadius: 2 }}
                            >
                                Upload
                            </Button>
                        </Stack>
                    </Paper>
                )}

                {isUploading && <LinearProgress sx={{ borderRadius: 1, height: 4 }} />}

                {/* Browsing Table Section */}
                <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
                        Stored Folder Objects ({files.length})
                    </Typography>

                    {isLoading ? (
                        <LinearProgress sx={{ my: 4 }} />
                    ) : files.length === 0 ? (
                        <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', borderRadius: 3, bgcolor: 'background.default' }}>
                            <Typography variant="body2" color="text.secondary">
                                No files found inside your authorized tier subdirectory directory folder.
                            </Typography>
                        </Paper>
                    ) : (
                        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3, bgcolor: 'background.paper' }}>
                            <Table size="small">
                                <TableHead sx={{ bgcolor: 'action.hover' }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 600, py: 1.5 }}>File Name</TableCell>
                                        <TableCell sx={{ fontWeight: 600, py: 1.5 }} align="right">Size</TableCell>
                                        <TableCell sx={{ fontWeight: 600, py: 1.5 }} align="center">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {files.map((file) => (
                                        <TableRow key={file.fullName} hover>
                                            <TableCell sx={{ py: 1, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <FileIcon fontSize="small" color="action" />
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{file.displayName}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ py: 1 }} align="right">{formatBytes(file.sizeBytes)}</TableCell>
                                            <TableCell sx={{ py: 1 }} align="center">
                                                <IconButton
                                                    color="primary"
                                                    size="small"
                                                    onClick={() => handleDownload(file.fullName, file.displayName)}
                                                    title="Download file"
                                                >
                                                    <DownloadIcon fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Box>
            </Stack>
        </Box>
    );
};

export default SharedFilesManager;
import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, Button, Paper, LinearProgress, Alert, Stack,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    IconButton, Select, MenuItem, FormControl, InputLabel, TextField,
    Breadcrumbs, Link, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import {
    CloudUpload as UploadIcon, InsertDriveFile as FileIcon,
    Download as DownloadIcon, Refresh as RefreshIcon, Close as CloseIcon,
    Delete as DeleteIcon, Edit as EditIcon, Check as CheckIcon,
    Folder as FolderIcon, CreateNewFolder as NewFolderIcon,
    NavigateNext as NavigateNextIcon, ContentCopy
} from '@mui/icons-material';

// Target your API layer handlers (including your folder operations)
import {
    uploadFile,
    fetchFilesByRole,
    downloadFile,
    deleteFile,
    renameFile,
    createFolder,
} from '../api/api.js';
import {isUserEqualAbove} from "../util/Util.jsx";
import {UserRole} from "../login/UserRole.ts";

const SharedFilesManager = ({ currentUser }) => {

    const [files, setFiles] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);

    // --- PATH NAVIGATION STATE ---
    // Tracks current nested path as an array: e.g., ['documents', 'images']
    const [currentPath, setCurrentPath] = useState([]);

    // UI States
    const [stagedFile, setStagedFile] = useState(null);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isDragActive, setIsDragActive] = useState(false);

    // Folder Creation Modal States
    const [folderModalOpen, setFolderModalOpen] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");

    // Inline Renaming Trackers
    const [editingFilename, setEditingFilename] = useState(null);
    const [newNameInput, setNewNameInput] = useState("");

    // Helper to turn array path into string key for backend context
    const getPathString = useCallback(() => currentPath.join('/'), [currentPath]);

    const loadFilesList = useCallback(async () => {
        setIsLoading(true);
        try {
            // Pass the target role partition AND the current active subpath string
            const data = await fetchFilesByRole(selectedRole, getPathString());
            setFiles(data || []);
        } catch (error) {
            setStatus({ type: 'error', message: error.message || "Failed to load files." });
        } finally {
            setIsLoading(false);
        }
    }, [selectedRole, getPathString]);

    useEffect(() => {
        loadFilesList();
    }, [loadFilesList]);

    const handleRoleDirectoryChange = (e) => {
        setSelectedRole(e.target.value);
        setCurrentPath([]); // Reset to root of new partition node
        setEditingFilename(null);
        setStatus({ type: '', message: '' });
    };

    // --- NAVIGATIONAL DRILL-DOWN ---
    const handleFolderClick = (folderName) => {
        setCurrentPath((prev) => [...prev, folderName]);
        setEditingFilename(null);
    };

    const handleBreadcrumbClick = (index) => {
        // Slice path array back to targeted index marker
        setCurrentPath((prev) => prev.slice(0, index + 1));
        setEditingFilename(null);
    };

    const handleNavigateToRoot = () => {
        setCurrentPath([]);
        setEditingFilename(null);
    };

    // --- DIR OPERATIONS ---
    const handleCreateFolder = async () => {
        if (!newFolderName.trim()) return;
        try {
            await createFolder(newFolderName.trim(), selectedRole, getPathString());
            setStatus({ type: 'success', message: `Folder "${newFolderName.trim()}" created successfully.` });
            setNewFolderName("");
            setFolderModalOpen(false);
            await loadFilesList();
        } catch (error) {
            setStatus({ type: 'error', message: error.message || "Failed to create folder." });
        }
    };

    const handleUpload = async () => {
        if (!stagedFile) return;
        setIsUploading(true);
        setStatus({ type: '', message: '' });

        try {
            // Pass sub-path location along with file payload context
            await uploadFile(stagedFile, selectedRole, getPathString());
            setStatus({ type: 'success', message: "File uploaded successfully." });
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
            await downloadFile(fullName, displayName, selectedRole, getPathString());
        } catch (error) {
            setStatus({ type: 'error', message: error.message || "Download failed." });
        }
    };

    const handleDelete = async (file) => {
        const targetType = file.isFolder ? "folder and all its contents" : "file";
        if (!window.confirm(`Are you sure you want to permanently delete this ${targetType}?`)) return;
        try {
            await deleteFile(file.fullName, selectedRole, getPathString());
            setStatus({ type: 'success', message: `Successfully deleted "${file.displayName}".` });
            await loadFilesList();
        } catch (error) {
            setStatus({ type: 'error', message: error.message || "Deletion failed." });
        }
    };

    const handleSaveRename = async (oldFullName) => {
        if (!newNameInput.trim()) return;
        try {
            await renameFile(oldFullName, newNameInput.trim(), selectedRole, getPathString());
            setEditingFilename(null);
            await loadFilesList();
            setStatus({ type: 'success', message: "Rename completed successfully." });
        } catch (error) {
            setStatus({ type: 'error', message: error.message || "Rename failed." });
        }
    };

    const handleDirectDownloadLink = async (file) => {
        try {

            const baseUrl = window.location.origin;
            const encodedFilename = encodeURIComponent(file.fullName);
            const encodedRole = encodeURIComponent(selectedRole);
            const encodedPath = encodeURIComponent(getPathString());

            const directDownloadUrl = `${baseUrl}/api/files/download/${encodedFilename}?role=${encodedRole}&path=${encodedPath}`;

            await navigator.clipboard.writeText(directDownloadUrl);

            setStatus({
                type: 'success',
                message: `Direct download link for "${file.displayName}" copied to clipboard!`
            });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            setStatus({
                type: 'error',
                message: "Failed to copy the link to clipboard."
            });
        }
    };

    const startRename = (file) => {
        setEditingFilename(file.fullName);
        setNewNameInput(file.displayName);
    };

    const handleDrag = useCallback((e) => {
        e.preventDefault(); e.stopPropagation();
        setIsDragActive(e.type === "dragenter" || e.type === "dragover");
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault(); e.stopPropagation();
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

    const formatBytes = (bytes) => {
        if (!bytes || bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <Box sx={{ py: 1 }}>
            <Stack gap={3}>
                {/* Header Controls */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, flexWrap: 'wrap' }}>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                            Shared Storage File Explorer
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Manage your files and folders within your assigned workspace.
                        </Typography>
                    </Box>

                    <Stack direction="row" gap={1.5} sx={{ width: { xs: '100%', sm: 'auto' }, alignItems: 'center' }}>
                        {isUserEqualAbove(currentUser, UserRole.ADMIN) && (
                            <Button
                                variant="contained"
                                color="success"
                                startIcon={<NewFolderIcon />}
                                onClick={() => setFolderModalOpen(true)}
                                sx={{ borderRadius: 2, height: 40 }}
                            >
                                New Folder
                            </Button>
                        )}

                        {isUserEqualAbove(currentUser, UserRole.ADMIN) ? (
                            <FormControl size="small" sx={{ minWidth: 160 }}>
                                <InputLabel id="storage-node-select-label">Active Node</InputLabel>
                                <Select
                                    labelId="storage-node-select-label"
                                    value={selectedRole}
                                    label="Active Node"
                                    onChange={handleRoleDirectoryChange}
                                    sx={{ borderRadius: 2 }}
                                >
                                    <MenuItem value="JOEY">JOEY</MenuItem>
                                    <MenuItem value="ADMIN">ADMIN</MenuItem>
                                    <MenuItem value="DEV">DEV</MenuItem>
                                    <MenuItem value="BOT">BOT</MenuItem>
                                    <MenuItem value="TRUSTED">TRUSTED</MenuItem>
                                </Select>
                            </FormControl>
                        ) : (
                            <Box sx={{ px: 2, py: 0.5, bgcolor: 'action.selected', borderRadius: 2, border: '1px solid divider' }}>
                                <Typography variant="caption" color="text.secondary" display="block">Partition</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedRole}</Typography>
                            </Box>
                        )}

                        <Button
                            variant="outlined"
                            startIcon={<RefreshIcon />}
                            onClick={loadFilesList}
                            disabled={isLoading || isUploading}
                            sx={{ borderRadius: 2, whiteSpace: 'nowrap', height: 40 }}
                        >
                            Refresh
                        </Button>
                    </Stack>
                </Box>

                {/* --- PATH BREADCRUMBS UI NAVIGATION --- */}
                <Paper variant="outlined" sx={{ px: 2, py: 1, borderRadius: 2, bgcolor: 'background.default', display: 'flex', alignItems: 'center' }}>
                    <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                        <Link
                            component="button"
                            underline="hover"
                            color={currentPath.length === 0 ? "text.primary" : "inherit"}
                            onClick={handleNavigateToRoot}
                            sx={{ fontWeight: currentPath.length === 0 ? 600 : 400, border: 'none', background: 'none', cursor: 'pointer' }}
                        >
                            {selectedRole} (Root)
                        </Link>
                        {currentPath.map((folder, index) => {
                            const isLast = index === currentPath.length - 1;
                            return (
                                <Link
                                    key={index}
                                    component="button"
                                    underline="hover"
                                    color={isLast ? "text.primary" : "inherit"}
                                    onClick={() => handleBreadcrumbClick(index)}
                                    disabled={isLast}
                                    sx={{ fontWeight: isLast ? 600 : 400, border: 'none', background: 'none', cursor: 'pointer' }}
                                >
                                    {folder}
                                </Link>
                            );
                        })}
                    </Breadcrumbs>
                </Paper>

                {status.message && (
                    <Alert severity={status.type} variant="outlined" sx={{ borderRadius: 2 }} onClose={() => setStatus({ type: '', message: '' })}>
                        {status.message}
                    </Alert>
                )}

                {/* Upload Zone */}
                <Paper
                    onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}
                    elevation={0}
                    sx={{
                        p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        borderRadius: 3, border: '2px dashed', borderColor: isDragActive ? 'primary.main' : 'divider',
                        bgcolor: isDragActive ? (theme) => `${theme.palette.primary.main}08` : 'background.default',
                        transition: 'all 0.2s ease', minHeight: 100
                    }}
                >
                    <input type="file" id="file-upload-input" style={{ display: 'none' }} onChange={handleFileChange} disabled={isUploading} />
                    <UploadIcon sx={{ fontSize: 32, color: isDragActive ? 'primary.main' : 'text.secondary', mb: 0.5 }} />
                    <Typography variant="body2" textAlign="center">
                        Drag and drop files here or{' '}
                        <label htmlFor="file-upload-input" style={{ color: '#2196f3', cursor: 'pointer', textDecoration: 'underline' }}>browse</label>
                    </Typography>
                </Paper>

                {/* Staging Bar */}
                {stagedFile && (
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <FileIcon color="primary" />
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                            <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>{stagedFile.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{formatBytes(stagedFile.size)}</Typography>
                        </Box>
                        <Stack direction="row" gap={1}>
                            <IconButton size="small" color="error" onClick={() => setStagedFile(null)} disabled={isUploading}><CloseIcon fontSize="small" /></IconButton>
                            <Button variant="contained" onClick={handleUpload} disabled={isUploading} sx={{ borderRadius: 2 }}>Upload</Button>
                        </Stack>
                    </Paper>
                )}

                {isUploading && <LinearProgress sx={{ borderRadius: 1, height: 4 }} />}

                {/* Object Table Layout */}
                <Box>
                    {isLoading ? (
                        <LinearProgress sx={{ my: 4 }} />
                    ) : files.length === 0 ? (
                        <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', borderRadius: 3, bgcolor: 'background.default' }}>
                            <Typography variant="body2" color="text.secondary">This folder is empty.</Typography>
                        </Paper>
                    ) : (
                        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
                            <Table size="small">
                                <TableHead sx={{ bgcolor: 'action.hover' }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 600, py: 1.5 }}>Name</TableCell>
                                        <TableCell sx={{ fontWeight: 600, py: 1.5 }} align="right">Size</TableCell>
                                        <TableCell sx={{ fontWeight: 600, py: 1.5 }} align="center">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {files.map((file) => (
                                        <TableRow key={file.fullName} hover>
                                            <TableCell sx={{ py: 1, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {editingFilename === file.fullName ? (
                                                    <TextField size="small" value={newNameInput} onChange={(e) => setNewNameInput(e.target.value)} sx={{ width: '80%' }} autoFocus />
                                                ) : (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                        {file.isFolder ? (
                                                            // Clicking on folders triggers navigation down the path array tree
                                                            <Link component="button" color="primary" onClick={() => handleFolderClick(file.displayName)} sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer', p: 0 }}>
                                                                <FolderIcon sx={{ color: '#ffa726' }} fontSize="small" />
                                                                {file.displayName}
                                                            </Link>
                                                        ) : (
                                                            <>
                                                                <FileIcon fontSize="small" color="action" />
                                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>{file.displayName}</Typography>
                                                            </>
                                                        )}
                                                    </Box>
                                                )}
                                            </TableCell>
                                            <TableCell sx={{ py: 1 }} align="right">
                                                {file.isFolder ? "--" : formatBytes(file.sizeBytes || file.size)}
                                            </TableCell>
                                            <TableCell sx={{ py: 1 }} align="center">
                                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                                                    {editingFilename === file.fullName ? (
                                                        <>
                                                            <IconButton size="small" color="success" onClick={() => handleSaveRename(file.fullName)}><CheckIcon fontSize="small" /></IconButton>
                                                            <IconButton size="small" color="error" onClick={() => setEditingFilename(null)}><CloseIcon fontSize="small" /></IconButton>
                                                        </>
                                                    ) : (
                                                        <>
                                                            {isUserEqualAbove(currentUser, UserRole.DEV) && (
                                                                <IconButton color="warning" size="small" onClick={() => startRename(file)} title="Rename"><EditIcon fontSize="small" /></IconButton>
                                                            )}
                                                            {!file.isFolder && (
                                                                <IconButton color="primary" size="small" onClick={() => handleDownload(file.fullName, file.displayName)} title="Download"><DownloadIcon fontSize="small" /></IconButton>
                                                            )}
                                                            {isUserEqualAbove(currentUser, UserRole.ADMIN) && (
                                                                <IconButton color="error" size="small" onClick={() => handleDelete(file)} title="Delete"><DeleteIcon fontSize="small" /></IconButton>
                                                            )}
                                                            {isUserEqualAbove(currentUser, UserRole.TRUSTED) && (
                                                                <IconButton color="success" size="small" onClick={() => handleDirectDownloadLink(file)} title="Delete"><ContentCopy  fontSize="small" /></IconButton>
                                                            )}
                                                        </>
                                                    )}
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Box>
            </Stack>

            {/* --- NEW FOLDER DIALOG TRIGGER NODE --- */}
            <Dialog open={folderModalOpen} onClose={() => setFolderModalOpen(false)} size="small">
                <DialogTitle>Create New Folder</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus margin="dense" label="Folder Name" type="text" fullWidth size="small" variant="outlined"
                        value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} sx={{ mt: 1, minWidth: 300 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setFolderModalOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateFolder} color="success" variant="contained">Create Folder</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SharedFilesManager;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import {
    Avatar,
    Grid,
    Typography,
    Paper,
    Box,
    IconButton,
    Modal,
    TextField,
    Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import profilePhoto from './images/profile.png'; // Adjust the path as necessary

const BASE_URL = process.env.REACT_APP_BASE_URL;

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    overflowY: 'auto',
};

const Profile = ({ onProfileUpdate }) => {
    const { user: authUser, token } = useAuth();
    const [formData, setFormData] = useState({ address: '', occupation: '' });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [open, setOpen] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const defaultImage = profilePhoto;

        if (authUser) {
            setFormData({
                address: authUser.address || '',
                occupation: authUser.occupation || '',
            });
            setPreview(authUser.profileImageUrl || defaultImage);
        } else {
            setPreview(defaultImage);
        }
    }, [authUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setError('');
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        let imageUrl = preview; // Default to the current preview URL
        const headers = { Authorization: `Bearer ${token}` };

        // Handle image upload...
        // (Upload logic can be implemented here)

        // Update profile with the new data
        try {
            const response = await axios.put(
                `${BASE_URL}/api/profile`,
                { ...formData, profileImageUrl: imageUrl },
                { headers }
            );

            setStatusMessage('Profile updated successfully!');
            onProfileUpdate(response.data.user);
            setOpen(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            setError(error.response?.data.message || 'Failed to update profile.');
        }
    };

    return (
        <>
            <Paper elevation={6} sx={{ padding: 4 }}>
                <Typography variant="h4" align="center">Profile</Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <Avatar src={preview} alt="Profile Preview" sx={{ width: 150, height: 150, marginBottom: 2 }} />
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Box sx={{ padding: 2 }}>
                            <Typography variant="body1">Name: {authUser?.name || 'N/A'}</Typography>
                            <Typography variant="body1">Email: {authUser?.email || 'N/A'}</Typography>
                            <Typography variant="body1">Address: {formData.address || 'N/A'}</Typography>
                            <Typography variant="body1">Occupation: {formData.occupation || 'N/A'}</Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <IconButton onClick={() => setOpen(true)}>
                                    <EditIcon />
                                </IconButton>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            <Modal open={open} onClose={() => setOpen(false)}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" gutterBottom>Edit Profile</Typography>
                    <input type="file" accept="image/*" hidden id="modal-image-upload" onChange={handleImageChange} />
                    <label htmlFor="modal-image-upload">
                        <Button variant="contained" component="span">Change Photo</Button>
                    </label>
                    <form onSubmit={handleSubmit}>
                        <TextField label="Address" name="address" value={formData.address} onChange={handleChange} fullWidth margin="normal" />
                        <TextField label="Occupation" name="occupation" value={formData.occupation} onChange={handleChange} fullWidth margin="normal" />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                            <Button type="submit" variant="contained">Update</Button>
                            <Button variant="outlined" onClick={() => setOpen(false)}>Cancel</Button>
                        </Box>
                    </form>
                </Box>
            </Modal>
        </>
    );
};

export default Profile;
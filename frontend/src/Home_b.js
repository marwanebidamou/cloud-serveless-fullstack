import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import About from './components/About';  
import Footer from './components/Footer'; 
import { useNavigate } from 'react-router-dom'; 
import profilePhoto from './images/profile.png'; 
import {
    Container,
    Avatar,
    Grid,
    Typography,
    Paper,
    Box,
    Button,
    IconButton,
    Modal,
    TextField,
    AppBar,
    Toolbar,
    Snackbar,
    Alert,
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { keyframes } from '@mui/system';

// Keyframes for animations
const swell = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    overflowY: 'auto',
    animation: `${fadeIn} 0.5s ease-in-out`,
};

// Base URL from environment variable
const BASE_URL = process.env.REACT_APP_BASE_URL;

// Header component
const Header = ({ onProfileClick, onAboutClick, onLogout }) => (
    <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                CloudPRO
            </Typography>
            <Button color="inherit" onClick={onProfileClick}>Profile</Button>
            <Button color="inherit" onClick={onAboutClick}>About</Button>
            <IconButton color="inherit" onClick={onLogout}>
                <LogoutIcon />
            </IconButton>
        </Toolbar>
    </AppBar>
);

// Main Profile Component
function Home() {
    const { user: authUser, token, logout } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ address: '', occupation: '' });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [open, setOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [view, setView] = useState('profile');

    useEffect(() => {
        const defaultImage = profilePhoto;
        if (authUser) {
            setFormData({
                address: authUser.address || '',
                occupation: authUser.occupation || '',
            });
            setPreview(authUser.profileImageUrl?.trim() || defaultImage);
        } else {
            const storedProfile = window.localStorage.getItem('profile');
            if (storedProfile) {
                const profileData = JSON.parse(storedProfile);
                setFormData({
                    address: profileData.address || '',
                    occupation: profileData.occupation || '',
                });
                setPreview(profileData.profileImageUrl?.trim() || defaultImage);
            } else {
                setPreview(defaultImage);
            }
        }
    }, [authUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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
        let imageUrl = preview;

        const headers = {
            Authorization: `Bearer ${token}`,
        };

        if (image) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64data = reader.result;
                try {
                    const imageResponse = await axios.get(`${BASE_URL}/api/profile/upload-url?fileType=${image.type}`, { headers });
                    alert(imageResponse.data.fileUrl);
                    await axios.put(imageResponse.data.uploadUrl, { data: base64data }, { headers: { 'Content-Type': 'application/json'} });
                    imageUrl = imageResponse.data.fileUrl;
                } catch (error) {
                    setSnackbarMessage('Failed to upload image. Please try again.');
                    setSnackbarOpen(true);
                    return;
                }
            };
            reader.readAsDataURL(image);
        }

        try {
            const response = await axios.put(
                `${BASE_URL}/api/profile`,
                { address: formData.address, occupation: formData.occupation, profileImageUrl: imageUrl },
                { headers }
            );
            window.localStorage.setItem('user', JSON.stringify(response.data.user));
            setSnackbarMessage('Profile updated successfully!');
            setSnackbarOpen(true);
            setOpen(false);
        } catch (error) {
            setSnackbarMessage('Failed to update profile.');
            setSnackbarOpen(true);
        }
    };

    const handleLogout = () => {
        logout();
        window.localStorage.removeItem('userData');
        navigate('/');
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f4f6f8' }}>
            <Header onProfileClick={() => setView('profile')} onAboutClick={() => setView('about')} onLogout={handleLogout} />

            <Container maxWidth="lg" sx={{ flex: 1, paddingBottom: '60px' }}>
                {view === 'profile' && (
                    <Paper elevation={6} sx={{ padding: 4, borderRadius: 2, width: '100%', maxWidth: 800, margin: '0 auto', marginTop: 2, animation: `${fadeIn} 0.5s ease-in-out`, boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
                        <Typography variant="h4" gutterBottom align="center" sx={{ color: '#1976d2', fontWeight: 'bold' }}>Profile</Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Avatar
                                    src={preview || `${BASE_URL}/uploads/profile.png`}
                                    alt="Profile Preview"
                                    sx={{ width: 150, height: 150, marginBottom: 2, '&:hover': { animation: `${swell} 0.5s ease-in-out` } }}
                                    style={{ backgroundColor: !preview ? '#ccc' : 'transparent' }}
                                />
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <Box sx={{ padding: 2, border: '1px solid #ccc', borderRadius: 2 }}>
                                    <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 1, mb: 2 }}>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#333' }}>Name:</Typography>
                                        <Typography variant="body1" sx={{ color: '#1976d2' }}>{authUser?.name || 'N/A'}</Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#333' }}>Email:</Typography>
                                        <Typography variant="body1" sx={{ color: '#1976d2' }}>{authUser?.email || 'N/A'}</Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#333' }}>Phone:</Typography>
                                        <Typography variant="body1" sx={{ color: '#1976d2' }}>{authUser?.phone || 'N/A'}</Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#333' }}>Address:</Typography>
                                        <Typography variant="body1" sx={{ color: '#1976d2' }}>{formData.address || 'N/A'}</Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#333' }}>Occupation:</Typography>
                                        <Typography variant="body1" sx={{ color: '#1976d2' }}>{formData.occupation || 'N/A'}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                                        <IconButton onClick={() => setOpen(true)}>
                                            <EditIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                )}

                {view === 'about' && <About />}
            </Container>

            <Footer />
            
            <Modal 
                open={open} 
                onClose={() => setOpen(false)} 
                sx={{ transition: 'all 0.8s ease-in-out' }} 
            >
                <Box sx={modalStyle}>
                    <Typography variant="h6" gutterBottom>Edit Profile</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 2 }}>
                        <Avatar
                            src={preview || `${BASE_URL}/uploads/profile.png`}
                            alt="Profile Preview"
                            sx={{ width: 100, height: 100, marginBottom: 2 }}
                        />
                        <input type="file" accept="image/*" hidden id="modal-image-upload" onChange={handleImageChange} />
                        <label htmlFor="modal-image-upload">
                            <Button variant="contained" component="span" color="primary">
                                Change Photo
                            </Button>
                        </label>
                    </Box>
                    <form onSubmit={handleSubmit}>
                        <TextField label="Address" name="address" value={formData.address} onChange={handleChange} fullWidth margin="normal" />
                        <TextField label="Occupation" name="occupation" value={formData.occupation} onChange={handleChange} fullWidth margin="normal" />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                            <Button type="submit" variant="contained" color="primary">Update</Button>
                            <Button variant="outlined" color="secondary" onClick={() => setOpen(false)}>Cancel</Button>
                        </Box>
                    </form>
                </Box>
            </Modal>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
                <Alert onClose={() => setSnackbarOpen(false)} severity="success">{snackbarMessage}</Alert>
            </Snackbar>
        </Box>
    );
}

export default Home;
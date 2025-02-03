import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import About from './components/About';  // Adjust the path if necessary
import Footer from './components/Footer'; // Adjust the path if necessary
import { useNavigate } from 'react-router-dom'; // Import useHistory for redirection
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
    Link,
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
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    overflowY: 'auto',
    animation: `${fadeIn} 0.5s ease-in-out`,
};

// Base URL from environment variable
const BASE_URL = process.env.REACT_APP_BASE_URL;

// Define the Header component
const Header = ({ onProfileClick, onAboutClick, onLogout }) => (
    <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
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

// Define the Footer component


<>
<Footer />


// Define the About component
<About />
</>

// Main Profile Component
function Profile() {
    const { user: authUser, token, logout } = useAuth();
    const history = useNavigate(); // Initialize useHistory for redirection
    const [formData, setFormData] = useState({ address: '', occupation: '' });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [open, setOpen] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [error, setError] = useState('');
    const [view, setView] = useState('profile');

    // Load user data from localStorage on component mount
    useEffect(() => {
        const defaultImage = profilePhoto; // Use your imported default image path
    
        if (authUser) {
            setFormData({
                address: authUser.address || '',
                occupation: authUser.occupation || '',
            });
            
            // Check if the profileImageUrl is valid (not empty or undefined)
            setPreview(authUser.profileImageUrl && authUser.profileImageUrl.trim() !== '' ? authUser.profileImageUrl : defaultImage);
            
        } else {
            const storedProfile = window.localStorage.getItem('userProfile');
            if (storedProfile) {
                const profileData = JSON.parse(storedProfile);
                setFormData({
                    address: profileData.address || '',
                    occupation: profileData.occupation || '',
                });
    
                // Check if the profileImageUrl is valid
                setPreview(profileData.profileImageUrl && profileData.profileImageUrl.trim() !== '' ? profileData.profileImageUrl : defaultImage);
            } else {
                // If no user data is available, use the default image
                setPreview(defaultImage);
            }
        }
    }, [authUser]);

    // Save user data to localStorage whenever authUser or formData changes
    useEffect(() => {
        if (authUser) {
            const userData = {
                ...authUser,
                address: formData.address,
                occupation: formData.occupation,
                profileImageUrl: preview,
            };
            window.localStorage.setItem('userData', JSON.stringify(userData));
        }
    }, [authUser, formData, preview]);

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
    
        // Reusable headers object
        const headers = {
            Authorization: `Bearer ${token}`,
            'User-Agent': navigator.userAgent,
            Accept: 'application/json',
            'Accept-Encoding': 'gzip, deflate, br',
            Connection: 'keep-alive',
        };
    
        // If a new image is uploaded, handle the upload
        if (image) {
            const reader = new FileReader();
            
            reader.onloadend = async () => {
                const base64data = reader.result; // This is the base64 image data
    
                try {
                    // Step 1: Get an upload URL from the server
                    const imageResponse = await axios.get(`${BASE_URL}/api/profile/upload-url?fileType=${image.type}`, {
                        headers,
                    });
    
                    if (!imageResponse.data.uploadUrl) {
                        throw new Error('Invalid response from server during image upload.');
                    }
    
                    // Step 2: Upload the image to the provided URL
                    await axios.put(imageResponse.data.uploadUrl, { data: base64data }, {
                        headers: { 
                            'Content-Type': 'image/jpeg', 
                            'User-Agent': 'insomnia/10.3.0'
                          },
                    });
    
                    console.log('Image uploaded successfully');
                    imageUrl = imageResponse.data.fileUrl; // Update the image URL to the uploaded one
                } catch (uploadError) {
                    console.error('Error uploading image:', uploadError);
                    setError('Failed to upload image. Please try again.');
                    return; // Exit if image upload fails
                }
            };
    
            reader.readAsDataURL(image); // Convert the image file to base64
        }
    
        // Update profile with the new data, including the uploaded image URL
        try {
            const response = await axios.put(
                `${BASE_URL}/api/profile`,
                {
                    address: formData.address,
                    occupation: formData.occupation,
                    profileImageUrl: imageUrl,
                },
                { headers }
            );
    
            // Update local storage with the new profile data
            window.localStorage.setItem('userProfile', JSON.stringify(response.data.user));
    
            setStatusMessage('Profile updated successfully!');
            setOpen(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            if (error.response) {
                setError(error.response.data.message || 'Failed to update profile.');
            } else {
                setError('Network error. Please try again later.');
            }
        }
    };

    


    const convertImageToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                resolve(reader.result.split(',')[1]);
            };
            reader.onerror = (error) => {
                console.error('Error reading file:', error);
                reject(error);
            };
        });
    };

    const handleLogout = () => {
        logout(); // Call the logout function from AuthContext
        window.localStorage.removeItem('userData'); // Clear user data from localStorage
        history('/'); // Redirect to home page
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header onProfileClick={() => setView('profile')} onAboutClick={() => setView('about')} onLogout={handleLogout} />

            <Container maxWidth="lg" sx={{ flex: 1, paddingBottom: '60px' }}>
                {view === 'profile' && (
                    <Paper elevation={6} sx={{ padding: 4, borderRadius: 2, width: '100%', maxWidth: 800, margin: '0 auto', marginTop: 2, animation: `${fadeIn} 0.5s ease-in-out`, boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
                        <Typography variant="h4" gutterBottom align="center" sx={{ color: '#1976d2' }}>Profile</Typography>
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
                                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'black' }}>Name:</Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>{authUser?.name || 'N/A'}</Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'black' }}>Email:</Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>{authUser?.email || 'N/A'}</Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'black' }}>Phone:</Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>{authUser?.phone || 'N/A'}</Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'black' }}>Address:</Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>{formData.address || 'N/A'}</Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'black' }}>Occupation:</Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>{formData.occupation || 'N/A'}</Typography>
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
        </Box>
    );
}

export default Profile;
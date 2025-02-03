import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    TextField,
    Button,
    Container,
    Typography,
    Paper,
    Grid,
    Box,
    CircularProgress,
} from '@mui/material';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

// Configure axios defaults
axios.defaults.withCredentials = false;

function Auth() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        occupation: '',
        password: '',
        profileImageUrl: '',
    });
    const [statusMessage, setStatusMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [file, setFile] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            const mytoken = "Hello!, there is no token for image processing";
    
            const headers = {
                Authorization: `Bearer ${mytoken}`,
                'User-Agent': navigator.userAgent,
                Accept: 'application/json',
                'Accept-Encoding': 'gzip, deflate, br',
                Connection: 'keep-alive',
            };
    
            try {
                const fileType = selectedFile.type; // Get the file type
                const response = await axios.get(`${BASE_URL}/api/profile/upload-url?fileType=${fileType}`, {
                    headers, // Include headers if necessary
                });
    
                const uploadUrl = response.data.uploadUrl; // Get the upload URL from the server
                const my_imageUrl = response.data.fileUrl; // Get the file URL
    
                alert(my_imageUrl);
                // Save the file path in form data
                setFormData((prevData) => ({ ...prevData, profileImageUrl: my_imageUrl }));
    
                // Convert the selected file to base64
                const reader = new FileReader();
                reader.onloadend = async () => {
                    const base64data = reader.result; // This is the base64 image data
    
                    // Step 2: Upload the image to the provided URL
                    try {
                        await axios.put(uploadUrl, selectedFile, {
                            headers : {
                                'Content-Type': 'image/jpeg', 
                              
                                'User-Agent': navigator.userAgent,
                                Accept: 'application/json',
                                'Accept-Encoding': 'gzip, deflate, br',
                                Connection: 'keep-alive',
                            },
                        });
    
                        console.log('Image uploaded successfully');
                    } catch (uploadError) {
                        console.error('Error uploading file:', uploadError);
                        setStatusMessage('Failed to upload image. Please try again.');
                    }
                };
    
                reader.readAsDataURL(selectedFile); // Convert the image file to base64
            } catch (error) {
                console.error('Error getting upload URL:', error);
                setStatusMessage('Failed to get upload URL. Please try again.');
            }
        }
    };

    const handleRemoveImage = () => {
        setFile(null);
        setPreview(null);
        setFormData((prevData) => ({ ...prevData, profileImageUrl: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMessage('');
        setIsLoading(true);

        // Set headers including necessary ones
        const headers = {
            'Content-Type': 'application/json',
            'User-Agent': navigator.userAgent, // Include User-Agent from the browser
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
        };

        try {
            let response;
            if (isLogin) {
                response = await axios.post(`${BASE_URL}/api/auth/login`, formData, { headers });
                login(response.data);
                setStatusMessage('Login successful!');
                navigate('/home'); // Redirect to profile on successful login
            } else {
                response = await axios.post(`${BASE_URL}/api/auth/signup`, formData, { headers });
                setStatusMessage('Signup successful! Logging in...');

                // Automatically login after successful signup
                const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
                    email: formData.email,
                    password: formData.password
                }, { headers });

                login(loginResponse.data);
                navigate('/home'); // Redirect to profile after automatic login
            }
        } catch (error) {
            setStatusMessage(error.response?.data?.message || 'An error occurred. Please try again.');
            console.error('Error details:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={6} sx={{ padding: 3, marginTop: 4 }}>
                <Typography variant="h4" gutterBottom align="center">
                    {isLogin ? 'Login' : 'Signup'}
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {!isLogin && (
                            <>
                                <Grid item xs={12}>
                                    <TextField label="Name" name="name" onChange={handleChange} fullWidth required />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField label="Phone" name="phone" onChange={handleChange} fullWidth required />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField label="Address" name="address" onChange={handleChange} fullWidth required />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField label="Occupation" name="occupation" onChange={handleChange} fullWidth required />
                                </Grid>
                                <Grid item xs={12}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={{ display: 'none' }}
                                        id="profile-picture-upload"
                                    />
                                    <label htmlFor="profile-picture-upload">
                                        <Button variant="outlined" component="span" fullWidth>
                                            Upload Profile Picture (optional)
                                        </Button>
                                    </label>
                                    {preview && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                                            <img src={preview} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '10px' }} />
                                            <Button variant="outlined" color="error" onClick={handleRemoveImage}>
                                                Remove
                                            </Button>
                                        </Box>
                                    )}
                                </Grid>
                            </>
                        )}
                        <Grid item xs={12}>
                            <TextField label="Email" name="email" type="email" onChange={handleChange} fullWidth required />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField type="password" label="Password" name="password" onChange={handleChange} fullWidth required />
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary" sx={{ width: '100%' }} disabled={isLoading}>
                                {isLoading ? <CircularProgress size={24} /> : (isLogin ? 'Login' : 'Signup')}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
                {statusMessage && (
                    <Box sx={{ marginTop: 2, color: statusMessage.includes('successful') ? 'green' : 'red', textAlign: 'center' }}>
                        <Typography>{statusMessage}</Typography>
                    </Box>
                )}
                <Typography onClick={() => setIsLogin(!isLogin)} sx={{ cursor: 'pointer', color: 'blue', marginTop: 2 }} align="center">
                    {isLogin ? 'Switch to Signup' : 'Switch to Login'}
                </Typography>
            </Paper>
        </Container>
    );
}

export default Auth;
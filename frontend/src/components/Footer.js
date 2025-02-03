import React, { useState } from 'react';
import {
    Box,
    Container,
    Grid,
    Avatar,
    Typography,
    IconButton,
    Link,
    TextField,
    Button,
    Snackbar,
    Alert,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import axios from 'axios';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleSubscribe = async () => {
        if (!email) {
            setSnackbarMessage('Please enter a valid email address.');
            setSnackbarOpen(true);
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/subscribe', { email });
            setSnackbarMessage(response.data.message);
            setEmail(''); // Clear the input field
        } catch (error) {
            console.error('Error subscribing:', error);
            setSnackbarMessage('Failed to subscribe. Please try again.');
        } finally {
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Box
            sx={{
                backgroundColor: '#1976d2',
                color: '#fff',
                padding: '40px 20px',
                marginTop: 'auto',
                width: '100%',
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    {/* Logo and Company Info */}
                    <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                            <Avatar
                                src="/path/to/logo.png" // Replace with actual logo path
                                alt="Company Logo"
                                sx={{ width: 60, height: 60, marginRight: 2 }}
                            />
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                CloudPRO
                            </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ marginBottom: 2 }}>
                            We are a leading company in cloud computing and web development, dedicated to delivering innovative solutions.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <IconButton href="https://facebook.com" target="_blank" sx={{ color: '#fff' }}>
                                <FacebookIcon />
                            </IconButton>
                            <IconButton href="https://twitter.com" target="_blank" sx={{ color: '#fff' }}>
                                <TwitterIcon />
                            </IconButton>
                            <IconButton href="https://linkedin.com" target="_blank" sx={{ color: '#fff' }}>
                                <LinkedInIcon />
                            </IconButton>
                        </Box>
                    </Grid>

                    {/* Quick Links */}
                    <Grid item xs={6} md={2}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                            Quick Links
                        </Typography>
                        <Link href="#" color="inherit" underline="hover" sx={{ display: 'block', marginBottom: 1 }}>
                            Home
                        </Link>
                        <Link href="#" color="inherit" underline="hover" sx={{ display: 'block', marginBottom: 1 }}>
                            Profile
                        </Link>
                        <Link href="#" color="inherit" underline="hover" sx={{ display: 'block', marginBottom: 1 }}>
                            About
                        </Link>
                        <Link href="#" color="inherit" underline="hover" sx={{ display: 'block', marginBottom: 1 }}>
                            Contact
                        </Link>
                    </Grid>

                    {/* Contact Info */}
                    <Grid item xs={6} md={3}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                            Contact Us
                        </Typography>
                        <Typography variant="body2" sx={{ marginBottom: 1 }}>
                            1000 N 4th Street, Fairfield, IA 52557
                        </Typography>
                        <Typography variant="body2" sx={{ marginBottom: 1 }}>
                            Email: info@c.com
                        </Typography>
                        <Typography variant="body2" sx={{ marginBottom: 1 }}>
                            Phone: +1 (123) 456-7890
                        </Typography>
                    </Grid>

                    {/* Newsletter */}
                    <Grid item xs={12} md={3}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                            Newsletter
                        </Typography>
                        <Typography variant="body2" sx={{ marginBottom: 2 }}>
                            Subscribe to our newsletter to get the latest updates.
                        </Typography>
                        <TextField
                            placeholder="Enter your email"
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ marginBottom: 2, backgroundColor: '#fff', borderRadius: 1 }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button variant="contained" color="secondary" fullWidth onClick={handleSubscribe}>
                            Subscribe
                        </Button>
                    </Grid>
                </Grid>

                {/* Snackbar for feedback */}
                <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                    <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>

                {/* Copyright */}
                <Typography variant="body2" align="center" sx={{ marginTop: 4, opacity: 0.8 }}>
                    © 2023 CloudPRO. All rights reserved.
                </Typography>
            </Container>
        </Box>
    );
};

export default Footer;
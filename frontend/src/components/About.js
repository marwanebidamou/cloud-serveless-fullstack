import React from 'react';
import { Box, Typography, Grid, Paper, Avatar } from '@mui/material';
import mercelPhoto from '../images/mercel.jpeg'; // Adjust the path as necessary
import profilePhoto from '../images/profile.png'; // Adjust the path as necessary
import ahmedPhoto from '../images/ahmed.jpeg'; // Adjust the path as necessary
import marwanPhoto from '../images/marwan.jpeg'; // Adjust the path as necessary

const About = () => {
    const developers = [
        {
            name: "Mercel",
            role: "Frontend Engineer",
            photo: mercelPhoto,
            bio: "",// "Passionate about creating beautiful and responsive web applications. Experienced in React, CSS, and JavaScript.",
            skills: ["React", "CSS", "JavaScript", "HTML", "Responsive Design"]
        },
        {
            name: "Ahmed",
            role: "Cloud Engineer",
            photo: ahmedPhoto,
            bio: "", //Cloud enthusiast with a background in AWS and Azure. Focused on building scalable cloud solutions.",
            skills: ["AWS", "Azure", "Docker", "Kubernetes", "DevOps"]
        },
        {
            name: "Marwan",
            role: "Backend Engineer",
            photo: marwanPhoto,
            bio: "", //Backend developer with expertise in Node.js and database management. Committed to optimizing server-side logic.",
            skills: ["Node.js", "Express", "MongoDB", "SQL", "APIs"]
        },
    ];

    return (
        <Box sx={{ padding: 4, animation: 'fadeIn 1s ease-in-out' }}>
            <Typography variant="h4" gutterBottom align="center" sx={{ 
                fontFamily: 'Arial, sans-serif', 
                fontWeight: 'bold', 
                color: '#1976d2',
                animation: 'slideDown 0.7s ease-in-out' 
            }}>
                About the Developers
            </Typography>
            <Grid container spacing={3}>
                {developers.map((dev, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Paper elevation={3} sx={{
                            padding: 3,
                            textAlign: 'center',
                            height: '100%',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                            '&:hover': { 
                                transform: 'scale(1.05)',
                                boxShadow: '0 8px 30px rgba(0,0,0,0.3)' 
                            },
                            animation: `bounce ${0.5 + index * 0.1}s ease-in-out`
                        }}>
                            <Avatar src={dev.photo} alt={dev.name} sx={{ 
                                width: 120, 
                                height: 120, 
                                margin: '0 auto', 
                                border: '3px solid #1976d2',
                                animation: 'spin 2s linear infinite' 
                            }} />
                            <Typography variant="h6" sx={{ color: '#1976d2', margin: '1rem 0 0.5rem' }}>{dev.name}</Typography>
                            <Typography variant="body1" sx={{ fontStyle: 'italic', color: '#555' }}>{dev.role}</Typography>
                            <Typography variant="body2" sx={{ margin: '0.5rem 0' }}>{dev.bio}</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1976d2' }}>Skills:</Typography>
                            <Typography variant="body2" sx={{ color: '#777' }}>{dev.skills.join(', ')}</Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Inline CSS for animations */}
            <style>
                {`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideDown {
                    from { transform: translateY(-20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-10px); }
                    60% { transform: translateY(-5px); }
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    50% { transform: rotate(10deg); }
                    100% { transform: rotate(-10deg); }
                }
                `}
            </style>
        </Box>
    );
};

export default About;
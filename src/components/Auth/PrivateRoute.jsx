import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <Box className="min-h-screen flex items-center justify-center">
                <Box className="text-center">
                    <CircularProgress size={60} />
                    <Typography variant="h6" className="mt-4" color="textSecondary">
                        Loading...
                    </Typography>
                </Box>
            </Box>
        );
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
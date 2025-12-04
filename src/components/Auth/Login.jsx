import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Alert,
    InputAdornment,
    IconButton,
    Container,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';
import HotelIcon from '@mui/icons-material/Hotel';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(credentials);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
        }

        setLoading(false);
    };

    return (
        <Box className="min-h-screen bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
            <Container maxWidth="sm">
                <Card className="shadow-2xl">
                    <CardContent className="p-8">
                        {/* Logo and Title */}
                        <Box className="text-center mb-6">
                            <HotelIcon className="text-blue-600 mb-2" style={{ fontSize: 60 }} />
                            <Typography variant="h4" className="font-bold text-gray-800 mb-2">
                                Hotel Management System
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Sign in to access your dashboard
                            </Typography>
                        </Box>

                        {/* Error Alert */}
                        {error && (
                            <Alert severity="error" className="mb-4">
                                {error}
                            </Alert>
                        )}

                        {/* Demo Credentials Info */}
                        <Alert severity="info" className="mb-4">
                            <Typography variant="caption" className="block">
                                <strong>Demo Credentials:</strong>
                            </Typography>
                            <Typography variant="caption" className="block">
                                Username: <strong>admin</strong>
                            </Typography>
                            <Typography variant="caption">
                                Password: <strong>admin123</strong>
                            </Typography>
                        </Alert>

                        {/* Login Form */}
                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Username or Email"
                                name="username"
                                value={credentials.username}
                                onChange={handleChange}
                                required
                                margin="normal"
                                autoFocus
                                autoComplete="username"
                            />

                            <TextField
                                fullWidth
                                label="Password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={credentials.password}
                                onChange={handleChange}
                                required
                                margin="normal"
                                autoComplete="current-password"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="large"
                                className="mt-6"
                                disabled={loading}
                                startIcon={<LoginIcon />}
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                            </Button>
                        </form>

                        {/* Footer */}
                        <Box className="mt-6 text-center">
                            <Typography variant="caption" color="textSecondary">
                                © 2025 Hotel Management System. All rights reserved.
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default Login;
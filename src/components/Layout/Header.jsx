import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Avatar,
    Box,
    Divider,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import LockIcon from '@mui/icons-material/Lock';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
        handleMenuClose();
    };

    return (
        <AppBar position="static" className="bg-linear-to-r from-blue-600 to-blue-800">
            <Toolbar>
                <Typography variant="h5" className="font-bold grow">
                    🏨 Hotel Management System
                </Typography>

                {/* User Menu */}
                <Box className="flex items-center gap-2">
                    <Typography variant="body2" className="mr-2 hidden sm:block">
                        {user?.fullName}
                    </Typography>
                    <Typography
                        variant="caption"
                        className="mr-3 px-2 py-1 bg-white text-black bg-opacity-20 rounded hidden sm:block"
                    >
                        {user?.role?.toUpperCase()}
                    </Typography>
                    <IconButton
                        onClick={handleMenuOpen}
                        color="inherit"
                    >
                        <Avatar className="bg-blue-800">
                            {user?.fullName?.charAt(0) || 'U'}
                        </Avatar>
                    </IconButton>
                </Box>

                {/* Dropdown Menu */}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    <Box className="px-4 py-2">
                        <Typography variant="subtitle2" className="font-bold">
                            {user?.fullName}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                            {user?.email}
                        </Typography>
                    </Box>
                    <Divider />
                    <MenuItem onClick={handleMenuClose}>
                        <AccountCircleIcon className="mr-2" fontSize="small" />
                        Profile
                    </MenuItem>
                    <MenuItem onClick={handleMenuClose}>
                        <LockIcon className="mr-2" fontSize="small" />
                        Change Password
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                        <LogoutIcon className="mr-2" fontSize="small" />
                        Logout
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
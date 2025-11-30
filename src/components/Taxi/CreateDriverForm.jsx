import React, { useState } from 'react';
import {
    Box,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
} from '@mui/material';
import { taxiAPI } from '../../services/api';

const CreateDriverForm = ({ onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        licenseNumber: '',
        vehicleNumber: '',
        vehicleType: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await taxiAPI.createDriver(formData);
            setSuccess(true);
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (error) {
            setError(error.response?.data?.message || 'Error creating driver');
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <DialogTitle className="bg-blue-600 text-white">
                Add New Driver
            </DialogTitle>
            <DialogContent className="mt-4">
                {error && <Alert severity="error" className="mb-4">{error}</Alert>}
                {success && <Alert severity="success" className="mb-4">Driver added successfully!</Alert>}

                <TextField
                    fullWidth
                    label="Driver Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    margin="normal"
                />

                <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    margin="normal"
                />

                <TextField
                    fullWidth
                    label="License Number"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    required
                    margin="normal"
                />

                <TextField
                    fullWidth
                    label="Vehicle Number"
                    name="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={handleChange}
                    required
                    margin="normal"
                />

                <FormControl fullWidth margin="normal" required>
                    <InputLabel>Vehicle Type</InputLabel>
                    <Select
                        name="vehicleType"
                        value={formData.vehicleType}
                        onChange={handleChange}
                        label="Vehicle Type"
                    >
                        <MenuItem value="sedan">Sedan</MenuItem>
                        <MenuItem value="suv">SUV</MenuItem>
                        <MenuItem value="luxury">Luxury</MenuItem>
                        <MenuItem value="van">Van</MenuItem>
                        <MenuItem value="bus">Bus</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions className="p-4">
                <Button onClick={onClose}>Cancel</Button>
                <Button type="submit" variant="contained" color="primary">
                    Add Driver
                </Button>
            </DialogActions>
        </Box>
    );
};

export default CreateDriverForm;
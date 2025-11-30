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
import { parkingAPI } from '../../services/api';

const CreateSlotForm = ({ onClose }) => {
    const [formData, setFormData] = useState({
        slotNumber: '',
        floor: '',
        type: '',
        rate: '',
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
            await parkingAPI.createSlot(formData);
            setSuccess(true);
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (error) {
            setError(error.response?.data?.message || 'Error creating slot');
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <DialogTitle className="bg-blue-600 text-white">
                Create Parking Slot
            </DialogTitle>
            <DialogContent className="mt-4">
                {error && <Alert severity="error" className="mb-4">{error}</Alert>}
                {success && <Alert severity="success" className="mb-4">Slot created successfully!</Alert>}

                <TextField
                    fullWidth
                    label="Slot Number"
                    name="slotNumber"
                    value={formData.slotNumber}
                    onChange={handleChange}
                    required
                    margin="normal"
                    placeholder="e.g., A-101"
                />

                <TextField
                    fullWidth
                    label="Floor"
                    name="floor"
                    value={formData.floor}
                    onChange={handleChange}
                    required
                    margin="normal"
                    placeholder="e.g., Ground, 1st, 2nd"
                />

                <FormControl fullWidth margin="normal" required>
                    <InputLabel>Vehicle Type</InputLabel>
                    <Select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        label="Vehicle Type"
                    >
                        <MenuItem value="car">Car</MenuItem>
                        <MenuItem value="bike">Bike</MenuItem>
                        <MenuItem value="van">Van</MenuItem>
                        <MenuItem value="bus">Bus</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    fullWidth
                    label="Hourly Rate (LKR)"
                    name="rate"
                    type="number"
                    value={formData.rate}
                    onChange={handleChange}
                    required
                    margin="normal"
                />
            </DialogContent>
            <DialogActions className="p-4">
                <Button onClick={onClose}>Cancel</Button>
                <Button type="submit" variant="contained" color="primary">
                    Create Slot
                </Button>
            </DialogActions>
        </Box>
    );
};

export default CreateSlotForm;
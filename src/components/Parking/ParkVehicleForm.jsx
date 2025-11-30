import React, { useState, useEffect } from 'react';
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

const ParkVehicleForm = ({ onClose }) => {
    const [formData, setFormData] = useState({
        vehicleNumber: '',
        vehicleType: '',
        guestName: '',
        guestRoom: '',
        guestPhone: '',
        parkingSlotId: '',
    });
    const [availableSlots, setAvailableSlots] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Define fetchAvailableSlots before useEffect
    const fetchAvailableSlots = async (type) => {
        try {
            const response = await parkingAPI.getAvailableSlots(type);
            setAvailableSlots(response.data.data);
        } catch (error) {
            console.error('Error fetching available slots:', error);
        }
    };

    useEffect(() => {
        if (formData.vehicleType) {
            fetchAvailableSlots(formData.vehicleType);
        } else {
            setAvailableSlots([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.vehicleType]);

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
            await parkingAPI.parkVehicle(formData);
            setSuccess(true);
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (error) {
            setError(error.response?.data?.message || 'Error parking vehicle');
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <DialogTitle className="bg-blue-600 text-white">
                Park Vehicle
            </DialogTitle>
            <DialogContent className="mt-4">
                {error && <Alert severity="error" className="mb-4">{error}</Alert>}
                {success && <Alert severity="success" className="mb-4">Vehicle parked successfully!</Alert>}

                <TextField
                    fullWidth
                    label="Vehicle Number"
                    name="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={handleChange}
                    required
                    margin="normal"
                    placeholder="e.g., MH-01-AB-1234"
                />

                <FormControl fullWidth margin="normal" required>
                    <InputLabel>Vehicle Type</InputLabel>
                    <Select
                        name="vehicleType"
                        value={formData.vehicleType}
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
                    label="Guest Name"
                    name="guestName"
                    value={formData.guestName}
                    onChange={handleChange}
                    required
                    margin="normal"
                />

                <TextField
                    fullWidth
                    label="Room Number"
                    name="guestRoom"
                    value={formData.guestRoom}
                    onChange={handleChange}
                    required
                    margin="normal"
                />

                <TextField
                    fullWidth
                    label="Phone Number"
                    name="guestPhone"
                    value={formData.guestPhone}
                    onChange={handleChange}
                    required
                    margin="normal"
                />

                <FormControl fullWidth margin="normal" required>
                    <InputLabel>Parking Slot</InputLabel>
                    <Select
                        name="parkingSlotId"
                        value={formData.parkingSlotId}
                        onChange={handleChange}
                        label="Parking Slot"
                        disabled={!formData.vehicleType}
                    >
                        {availableSlots.map((slot) => (
                            <MenuItem key={slot._id} value={slot._id}>
                                {slot.slotNumber} - Floor {slot.floor} (LKR {slot.rate}/hr)
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {formData.vehicleType && availableSlots.length === 0 && (
                    <Alert severity="warning" className="mt-2">
                        No available slots for this vehicle type
                    </Alert>
                )}
            </DialogContent>
            <DialogActions className="p-4">
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={!formData.parkingSlotId}
                >
                    Park Vehicle
                </Button>
            </DialogActions>
        </Box>
    );
};

export default ParkVehicleForm;
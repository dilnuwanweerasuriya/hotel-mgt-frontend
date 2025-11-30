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
    Grid,
} from '@mui/material';
import { taxiAPI } from '../../services/api';

const CreateBookingForm = ({ onClose }) => {
    const [formData, setFormData] = useState({
        guestName: '',
        guestRoom: '',
        guestPhone: '',
        pickupLocation: '',
        dropLocation: '',
        pickupTime: '',
        vehicleType: '',
        distance: '',
        notes: '',
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
            await taxiAPI.createBooking({
                ...formData,
                distance: parseFloat(formData.distance),
            });
            setSuccess(true);
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (error) {
            setError(error.response?.data?.message || 'Error creating booking');
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <DialogTitle className="bg-blue-600 text-white">
                Create Taxi Booking
            </DialogTitle>
            <DialogContent className="mt-4">
                {error && <Alert severity="error" className="mb-4">{error}</Alert>}
                {success && <Alert severity="success" className="mb-4">Booking created successfully!</Alert>}

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Guest Name"
                            name="guestName"
                            value={formData.guestName}
                            onChange={handleChange}
                            required
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Room Number"
                            name="guestRoom"
                            value={formData.guestRoom}
                            onChange={handleChange}
                            required
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Phone Number"
                            name="guestPhone"
                            value={formData.guestPhone}
                            onChange={handleChange}
                            required
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Pickup Location"
                            name="pickupLocation"
                            value={formData.pickupLocation}
                            onChange={handleChange}
                            required
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Drop Location"
                            name="dropLocation"
                            value={formData.dropLocation}
                            onChange={handleChange}
                            required
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Pickup Time"
                            name="pickupTime"
                            type="datetime-local"
                            value={formData.pickupTime}
                            onChange={handleChange}
                            required
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth margin="normal" required>
                            <InputLabel>Vehicle Type</InputLabel>
                            <Select
                                name="vehicleType"
                                value={formData.vehicleType}
                                onChange={handleChange}
                                label="Vehicle Type"
                            >
                                <MenuItem value="sedan">Sedan (LKR 50 + LKR 12/km)</MenuItem>
                                <MenuItem value="suv">SUV (LKR 80 + LKR 15/km)</MenuItem>
                                <MenuItem value="luxury">Luxury (LKR 150 + LKR 25/km)</MenuItem>
                                <MenuItem value="van">Van (LKR 100 + LKR 18/km)</MenuItem>
                                <MenuItem value="bus">Bus (LKR 200 + LKR 20/km)</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Distance (km)"
                            name="distance"
                            type="number"
                            value={formData.distance}
                            onChange={handleChange}
                            required
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            margin="normal"
                            multiline
                            rows={2}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions className="p-4">
                <Button onClick={onClose}>Cancel</Button>
                <Button type="submit" variant="contained" color="primary">
                    Create Booking
                </Button>
            </DialogActions>
        </Box>
    );
};

export default CreateBookingForm;
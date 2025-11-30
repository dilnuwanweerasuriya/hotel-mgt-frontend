import React, { useState, useEffect } from 'react';
import {
  Box,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Typography,
  Chip,
} from '@mui/material';
import { taxiAPI } from '../../services/api';

const AssignDriverDialog = ({ booking, onClose }) => {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [error, setError] = useState('');

  // Define fetchAvailableDrivers before useEffect
  const fetchAvailableDrivers = async () => {
    if (!booking) return;

    try {
      const response = await taxiAPI.getAvailableDrivers(booking.vehicleType);
      setDrivers(response.data.data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  };

  useEffect(() => {
    fetchAvailableDrivers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking]);

  const handleAssign = async () => {
    try {
      await taxiAPI.assignDriver(booking._id, selectedDriver);
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || 'Error assigning driver');
    }
  };

  return (
    <>
      <DialogTitle>Assign Driver to Booking</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" className="mb-4">{error}</Alert>}

        <Box className="mb-4">
          <Typography variant="body2"><strong>Booking ID:</strong> {booking?.bookingId}</Typography>
          <Typography variant="body2"><strong>Vehicle Type:</strong> {booking?.vehicleType}</Typography>
        </Box>

        <FormControl fullWidth>
          <InputLabel>Select Driver</InputLabel>
          <Select
            value={selectedDriver}
            onChange={(e) => setSelectedDriver(e.target.value)}
            label="Select Driver"
          >
            {drivers.map((driver) => (
              <MenuItem key={driver._id} value={driver._id}>
                <Box className="flex justify-between w-full items-center">
                  <Box>
                    <Typography variant="body2">{driver.name}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {driver.vehicleNumber} | {driver.phone}
                    </Typography>
                  </Box>
                  <Chip
                    label={`⭐ ${driver.rating}`}
                    size="small"
                    color="primary"
                  />
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {drivers.length === 0 && (
          <Alert severity="warning" className="mt-4">
            No available drivers for this vehicle type
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleAssign}
          variant="contained"
          color="primary"
          disabled={!selectedDriver}
        >
          Assign Driver
        </Button>
      </DialogActions>
    </>
  );
};

export default AssignDriverDialog;
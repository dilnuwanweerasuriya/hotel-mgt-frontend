import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import { parkingAPI } from '../../services/api';

const ParkingSlotGrid = ({ refreshKey }) => {
    const [slots, setSlots] = useState([]);
    const [filter, setFilter] = useState('all');

    // Define fetchSlots before useEffect
    const fetchSlots = async () => {
        try {
            const response = await parkingAPI.getAllSlots();
            let filteredSlots = response.data.data;

            if (filter !== 'all') {
                filteredSlots = filteredSlots.filter(slot => slot.status === filter);
            }

            setSlots(filteredSlots);
        } catch (error) {
            console.error('Error fetching slots:', error);
        }
    };

    useEffect(() => {
        fetchSlots();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshKey, filter]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'available':
                return 'success';
            case 'occupied':
                return 'error';
            case 'reserved':
                return 'warning';
            case 'maintenance':
                return 'default';
            default:
                return 'default';
        }
    };

    const getSlotColor = (status) => {
        switch (status) {
            case 'available':
                return 'bg-green-50 border-green-300';
            case 'occupied':
                return 'bg-red-50 border-red-300';
            case 'reserved':
                return 'bg-yellow-50 border-yellow-300';
            case 'maintenance':
                return 'bg-gray-50 border-gray-300';
            default:
                return 'bg-white border-gray-200';
        }
    };

    return (
        <Card>
            <CardContent>
                <Box className="flex justify-between items-center mb-4">
                    <Typography variant="h6" className="font-bold">
                        Parking Slots
                    </Typography>
                    <FormControl size="small" className="w-40">
                        <InputLabel>Filter</InputLabel>
                        <Select
                            value={filter}
                            label="Filter"
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <MenuItem value="all">All Slots</MenuItem>
                            <MenuItem value="available">Available</MenuItem>
                            <MenuItem value="occupied">Occupied</MenuItem>
                            <MenuItem value="reserved">Reserved</MenuItem>
                            <MenuItem value="maintenance">Maintenance</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Grid container spacing={2}>
                    {slots.map((slot) => (
                        <Grid item xs={6} sm={4} md={3} lg={2} key={slot._id}>
                            <Card
                                className={`border-2 ${getSlotColor(slot.status)} hover:shadow-md transition-shadow cursor-pointer`}
                            >
                                <CardContent className="text-center p-3">
                                    <LocalParkingIcon
                                        className={`mb-2 ${slot.status === 'available' ? 'text-green-600' : 'text-gray-400'
                                            }`}
                                    />
                                    <Typography variant="h6" className="font-bold">
                                        {slot.slotNumber}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary" className="block">
                                        Floor: {slot.floor}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary" className="block mb-2">
                                        {slot.type.toUpperCase()}
                                    </Typography>
                                    <Chip
                                        label={slot.status}
                                        color={getStatusColor(slot.status)}
                                        size="small"
                                        className="capitalize"
                                    />
                                    <Typography variant="caption" className="block mt-2 font-semibold">
                                        LKR {slot.rate}/hr
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {slots.length === 0 && (
                    <Box className="text-center py-8">
                        <Typography color="textSecondary">
                            No parking slots found
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default ParkingSlotGrid;
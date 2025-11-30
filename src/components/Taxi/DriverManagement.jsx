import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Button,
    Dialog,
    Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { taxiAPI } from '../../services/api';
import CreateDriverForm from './CreateDriverForm';

const DriverManagement = ({ refreshKey, onRefresh }) => {
    const [drivers, setDrivers] = useState([]);
    const [showCreateDriver, setShowCreateDriver] = useState(false);

    // Define fetchDrivers before useEffect using useCallback
    const fetchDrivers = useCallback(async () => {
        try {
            const response = await taxiAPI.getAllDrivers();
            setDrivers(response.data.data);
        } catch (error) {
            console.error('Error fetching drivers:', error);
        }
    }, []);

    useEffect(() => {
        fetchDrivers();
    }, [refreshKey, fetchDrivers]);

    const getStatusColor = (status) => {
        const colors = {
            available: 'success',
            busy: 'warning',
            'off-duty': 'error',
        };
        return colors[status] || 'default';
    };

    return (
        <>
            <Box className="flex justify-between items-center mb-4">
                <Typography variant="h6" className="font-bold">
                    Driver Management
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setShowCreateDriver(true)}
                >
                    Add Driver
                </Button>
            </Box>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow className="bg-gray-100">
                            <TableCell className="font-bold">Name</TableCell>
                            <TableCell className="font-bold">Phone</TableCell>
                            <TableCell className="font-bold">License Number</TableCell>
                            <TableCell className="font-bold">Vehicle Number</TableCell>
                            <TableCell className="font-bold">Vehicle Type</TableCell>
                            <TableCell className="font-bold">Rating</TableCell>
                            <TableCell className="font-bold">Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {drivers.map((driver) => (
                            <TableRow key={driver._id} hover>
                                <TableCell className="font-semibold">{driver.name}</TableCell>
                                <TableCell>{driver.phone}</TableCell>
                                <TableCell>{driver.licenseNumber}</TableCell>
                                <TableCell>{driver.vehicleNumber}</TableCell>
                                <TableCell>
                                    <Chip label={driver.vehicleType} size="small" className="capitalize" />
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={`⭐ ${driver.rating}`}
                                        size="small"
                                        color="primary"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={driver.status}
                                        color={getStatusColor(driver.status)}
                                        size="small"
                                        className="capitalize"
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {drivers.length === 0 && (
                <Box className="text-center py-8">
                    <Typography color="textSecondary">No drivers found</Typography>
                </Box>
            )}

            {/* Create Driver Dialog */}
            <Dialog
                open={showCreateDriver}
                onClose={() => setShowCreateDriver(false)}
                maxWidth="sm"
                fullWidth
            >
                <CreateDriverForm
                    onClose={() => {
                        setShowCreateDriver(false);
                        onRefresh();
                    }}
                />
            </Dialog>
        </>
    );
};

export default DriverManagement;
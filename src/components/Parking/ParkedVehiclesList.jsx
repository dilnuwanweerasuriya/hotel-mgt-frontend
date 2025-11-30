import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
} from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { parkingAPI } from '../../services/api';
import moment from 'moment';

const ParkedVehiclesList = ({ refreshKey, onRefresh }) => {
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [openExitDialog, setOpenExitDialog] = useState(false);
    const [exitDetails, setExitDetails] = useState(null);

    const fetchVehicles = useCallback(async () => {
        try {
            const response = await parkingAPI.getParkedVehicles();
            setVehicles(response.data.data);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        }
    }, []);

    useEffect(() => {
        fetchVehicles();
    }, [refreshKey, fetchVehicles]);

    const handleExitClick = (vehicle) => {
        setSelectedVehicle(vehicle);
        setOpenExitDialog(true);
    };

    const handleExitConfirm = async () => {
        try {
            const response = await parkingAPI.exitVehicle(selectedVehicle._id);
            setExitDetails(response.data.data);
            setOpenExitDialog(false);
            onRefresh();
        } catch (error) {
            console.error('Error exiting vehicle:', error);
        }
    };

    const calculateDuration = (entryTime) => {
        const now = moment();
        const entry = moment(entryTime);
        const duration = moment.duration(now.diff(entry));
        const hours = Math.floor(duration.asHours());
        const minutes = duration.minutes();
        return `${hours}h ${minutes}m`;
    };

    return (
        <>
            <Card>
                <CardContent>
                    <Typography variant="h6" className="font-bold mb-4">
                        Currently Parked Vehicles
                    </Typography>

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow className="bg-gray-100">
                                    <TableCell className="font-bold">Vehicle Number</TableCell>
                                    <TableCell className="font-bold">Type</TableCell>
                                    <TableCell className="font-bold">Guest Name</TableCell>
                                    <TableCell className="font-bold">Room</TableCell>
                                    <TableCell className="font-bold">Phone</TableCell>
                                    <TableCell className="font-bold">Slot</TableCell>
                                    <TableCell className="font-bold">Entry Time</TableCell>
                                    <TableCell className="font-bold">Duration</TableCell>
                                    <TableCell className="font-bold">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {vehicles.map((vehicle) => (
                                    <TableRow key={vehicle._id} hover>
                                        <TableCell className="font-semibold">
                                            {vehicle.vehicleNumber}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={vehicle.vehicleType}
                                                size="small"
                                                className="capitalize"
                                            />
                                        </TableCell>
                                        <TableCell>{vehicle.guestName}</TableCell>
                                        <TableCell>{vehicle.guestRoom}</TableCell>
                                        <TableCell>{vehicle.guestPhone}</TableCell>
                                        <TableCell>
                                            {vehicle.parkingSlot?.slotNumber} (Floor {vehicle.parkingSlot?.floor})
                                        </TableCell>
                                        <TableCell>
                                            {moment(vehicle.entryTime).format('DD/MM/YY HH:mm')}
                                        </TableCell>
                                        <TableCell>
                                            {calculateDuration(vehicle.entryTime)}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                size="small"
                                                startIcon={<ExitToAppIcon />}
                                                onClick={() => handleExitClick(vehicle)}
                                            >
                                                Exit
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {vehicles.length === 0 && (
                        <Box className="text-center py-8">
                            <Typography color="textSecondary">
                                No vehicles currently parked
                            </Typography>
                        </Box>
                    )}
                </CardContent>
            </Card>

            {/* Exit Confirmation Dialog */}
            <Dialog open={openExitDialog} onClose={() => setOpenExitDialog(false)}>
                <DialogTitle>Confirm Vehicle Exit</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to process exit for vehicle{' '}
                        <strong>{selectedVehicle?.vehicleNumber}</strong>?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenExitDialog(false)}>Cancel</Button>
                    <Button onClick={handleExitConfirm} variant="contained" color="primary">
                        Confirm Exit
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Exit Details Dialog */}
            <Dialog open={!!exitDetails} onClose={() => setExitDetails(null)} maxWidth="sm" fullWidth>
                <DialogTitle className="bg-green-600 text-white">
                    Exit Processed Successfully
                </DialogTitle>
                <DialogContent className="mt-4">
                    <Alert severity="success" className="mb-4">
                        Vehicle has been successfully checked out!
                    </Alert>

                    <Box className="space-y-2">
                        <Typography><strong>Vehicle:</strong> {exitDetails?.vehicleNumber}</Typography>
                        <Typography><strong>Entry Time:</strong> {moment(exitDetails?.entryTime).format('DD/MM/YYYY HH:mm')}</Typography>
                        <Typography><strong>Exit Time:</strong> {moment(exitDetails?.exitTime).format('DD/MM/YYYY HH:mm')}</Typography>
                        <Typography className="text-lg font-bold text-green-600 mt-4">
                            Total Amount: LKR {exitDetails?.totalAmount}
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setExitDetails(null)} variant="contained">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ParkedVehiclesList;
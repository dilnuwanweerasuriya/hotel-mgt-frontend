import React, { useState, useEffect } from 'react';
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
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Button,
    Grid,
    Tabs,
    Tab,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import FilterListIcon from '@mui/icons-material/FilterList';
import { parkingAPI } from '../../services/api';
import moment from 'moment';

const VehicleLogging = ({ refreshKey }) => {
    const [allVehicles, setAllVehicles] = useState([]);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const [filters, setFilters] = useState({
        status: 'all',
        vehicleType: 'all',
        dateFrom: '',
        dateTo: '',
        searchTerm: '',
    });

    useEffect(() => {
        fetchAllVehicles();
    }, [refreshKey]);

    useEffect(() => {
        applyFilters();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters, allVehicles, activeTab]);

    const fetchAllVehicles = async () => {
        try {
            // Fetch all vehicles (both parked and exited)
            const response = await parkingAPI.getAllVehicleHistory();
            setAllVehicles(response.data.data);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        }
    };

    const applyFilters = () => {
        let filtered = [...allVehicles];

        // Tab filter
        if (activeTab === 0) {
            // All entries
        } else if (activeTab === 1) {
            filtered = filtered.filter(v => v.status === 'parked');
        } else if (activeTab === 2) {
            filtered = filtered.filter(v => v.status === 'exited');
        }

        // Status filter
        if (filters.status !== 'all') {
            filtered = filtered.filter(v => v.status === filters.status);
        }

        // Vehicle type filter
        if (filters.vehicleType !== 'all') {
            filtered = filtered.filter(v => v.vehicleType === filters.vehicleType);
        }

        // Date range filter
        if (filters.dateFrom) {
            filtered = filtered.filter(v =>
                moment(v.entryTime).isAfter(moment(filters.dateFrom))
            );
        }
        if (filters.dateTo) {
            filtered = filtered.filter(v =>
                moment(v.entryTime).isBefore(moment(filters.dateTo).add(1, 'day'))
            );
        }

        // Search filter
        if (filters.searchTerm) {
            const search = filters.searchTerm.toLowerCase();
            filtered = filtered.filter(v =>
                v.vehicleNumber.toLowerCase().includes(search) ||
                v.guestName.toLowerCase().includes(search) ||
                v.guestRoom.toLowerCase().includes(search)
            );
        }

        // Sort by entry time (newest first)
        filtered.sort((a, b) => new Date(b.entryTime) - new Date(a.entryTime));

        setFilteredVehicles(filtered);
    };

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const clearFilters = () => {
        setFilters({
            status: 'all',
            vehicleType: 'all',
            dateFrom: '',
            dateTo: '',
            searchTerm: '',
        });
    };

    const calculateDuration = (entryTime, exitTime) => {
        if (!exitTime) {
            const now = moment();
            const entry = moment(entryTime);
            const duration = moment.duration(now.diff(entry));
            const hours = Math.floor(duration.asHours());
            const minutes = duration.minutes();
            return `${hours}h ${minutes}m (Ongoing)`;
        }

        const entry = moment(entryTime);
        const exit = moment(exitTime);
        const duration = moment.duration(exit.diff(entry));
        const hours = Math.floor(duration.asHours());
        const minutes = duration.minutes();
        return `${hours}h ${minutes}m`;
    };

    const exportToCSV = () => {
        const headers = ['Vehicle Number', 'Type', 'Guest Name', 'Room', 'Phone', 'Entry Time', 'Exit Time', 'Duration', 'Amount', 'Status'];
        const csvData = filteredVehicles.map(v => [
            v.vehicleNumber,
            v.vehicleType,
            v.guestName,
            v.guestRoom,
            v.guestPhone,
            moment(v.entryTime).format('DD/MM/YYYY HH:mm'),
            v.exitTime ? moment(v.exitTime).format('DD/MM/YYYY HH:mm') : '-',
            calculateDuration(v.entryTime, v.exitTime),
            v.totalAmount || '-',
            v.status,
        ]);

        const csv = [
            headers.join(','),
            ...csvData.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `parking-log-${moment().format('YYYY-MM-DD')}.csv`;
        a.click();
    };

    const getStatusColor = (status) => {
        return status === 'parked' ? 'primary' : 'success';
    };

    const calculateTotalRevenue = () => {
        return filteredVehicles
            .filter(v => v.status === 'exited')
            .reduce((sum, v) => sum + (v.totalAmount || 0), 0);
    };

    return (
        <Card>
            <CardContent>
                <Box className="flex justify-between items-center mb-4">
                    <Typography variant="h6" className="font-bold">
                        Entry/Exit Logging
                    </Typography>
                    <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={exportToCSV}
                    >
                        Export CSV
                    </Button>
                </Box>

                {/* Tabs */}
                <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} className="mb-4">
                    <Tab label={`All Entries (${allVehicles.length})`} />
                    <Tab label={`Currently Parked (${allVehicles.filter(v => v.status === 'parked').length})`} />
                    <Tab label={`Exited (${allVehicles.filter(v => v.status === 'exited').length})`} />
                </Tabs>

                {/* Filters */}
                <Card variant="outlined" className="mb-4 bg-gray-50">
                    <CardContent>
                        <Box className="flex items-center mb-3">
                            <FilterListIcon className="mr-2" />
                            <Typography variant="subtitle1" className="font-semibold">
                                Filters
                            </Typography>
                        </Box>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={2}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        value={filters.status}
                                        label="Status"
                                        onChange={(e) => handleFilterChange('status', e.target.value)}
                                    >
                                        <MenuItem value="all">All</MenuItem>
                                        <MenuItem value="parked">Parked</MenuItem>
                                        <MenuItem value="exited">Exited</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={2}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Vehicle Type</InputLabel>
                                    <Select
                                        value={filters.vehicleType}
                                        label="Vehicle Type"
                                        onChange={(e) => handleFilterChange('vehicleType', e.target.value)}
                                    >
                                        <MenuItem value="all">All Types</MenuItem>
                                        <MenuItem value="car">Car</MenuItem>
                                        <MenuItem value="bike">Bike</MenuItem>
                                        <MenuItem value="van">Van</MenuItem>
                                        <MenuItem value="bus">Bus</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={2}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="From Date"
                                    type="date"
                                    value={filters.dateFrom}
                                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={2}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="To Date"
                                    type="date"
                                    value={filters.dateTo}
                                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Search (Vehicle/Guest/Room)"
                                    value={filters.searchTerm}
                                    onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={1}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={clearFilters}
                                    size="small"
                                >
                                    Clear
                                </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Summary Stats */}
                <Grid container spacing={2} className="mb-4">
                    <Grid item xs={12} sm={4}>
                        <Card variant="outlined" className="bg-blue-50">
                            <CardContent className="py-2">
                                <Typography variant="caption" color="textSecondary">
                                    Filtered Entries
                                </Typography>
                                <Typography variant="h6" className="font-bold">
                                    {filteredVehicles.length}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Card variant="outlined" className="bg-green-50">
                            <CardContent className="py-2">
                                <Typography variant="caption" color="textSecondary">
                                    Total Revenue (Exited)
                                </Typography>
                                <Typography variant="h6" className="font-bold">
                                    LKR {calculateTotalRevenue()}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Card variant="outlined" className="bg-purple-50">
                            <CardContent className="py-2">
                                <Typography variant="caption" color="textSecondary">
                                    Currently Parked
                                </Typography>
                                <Typography variant="h6" className="font-bold">
                                    {filteredVehicles.filter(v => v.status === 'parked').length}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Table */}
                <TableContainer style={{ maxHeight: 600 }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell className="font-bold bg-gray-100">Vehicle Number</TableCell>
                                <TableCell className="font-bold bg-gray-100">Type</TableCell>
                                <TableCell className="font-bold bg-gray-100">Guest Name</TableCell>
                                <TableCell className="font-bold bg-gray-100">Room</TableCell>
                                <TableCell className="font-bold bg-gray-100">Phone</TableCell>
                                <TableCell className="font-bold bg-gray-100">Slot</TableCell>
                                <TableCell className="font-bold bg-gray-100">Entry Time</TableCell>
                                <TableCell className="font-bold bg-gray-100">Exit Time</TableCell>
                                <TableCell className="font-bold bg-gray-100">Duration</TableCell>
                                <TableCell className="font-bold bg-gray-100">Amount</TableCell>
                                <TableCell className="font-bold bg-gray-100">Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredVehicles.map((vehicle) => (
                                <TableRow key={vehicle._id} hover>
                                    <TableCell className="font-semibold">
                                        {vehicle.vehicleNumber}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={vehicle.vehicleType}
                                            size="small"
                                            className="capitalize"
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell>{vehicle.guestName}</TableCell>
                                    <TableCell>{vehicle.guestRoom}</TableCell>
                                    <TableCell>{vehicle.guestPhone}</TableCell>
                                    <TableCell>
                                        {vehicle.parkingSlot?.slotNumber || '-'}
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {moment(vehicle.entryTime).format('DD/MM/YY')}
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            {moment(vehicle.entryTime).format('HH:mm')}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {vehicle.exitTime ? (
                                            <>
                                                <Typography variant="body2">
                                                    {moment(vehicle.exitTime).format('DD/MM/YY')}
                                                </Typography>
                                                <Typography variant="caption" color="textSecondary">
                                                    {moment(vehicle.exitTime).format('HH:mm')}
                                                </Typography>
                                            </>
                                        ) : (
                                            <Chip label="Active" size="small" color="primary" />
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {calculateDuration(vehicle.entryTime, vehicle.exitTime)}
                                    </TableCell>
                                    <TableCell>
                                        {vehicle.totalAmount ? (
                                            <Typography className="font-bold text-green-600">
                                                LKR {vehicle.totalAmount}
                                            </Typography>
                                        ) : (
                                            <Typography color="textSecondary">-</Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={vehicle.status}
                                            color={getStatusColor(vehicle.status)}
                                            size="small"
                                            className="capitalize"
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {filteredVehicles.length === 0 && (
                    <Box className="text-center py-8">
                        <Typography color="textSecondary">
                            No vehicle entries found matching the filters
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default VehicleLogging;
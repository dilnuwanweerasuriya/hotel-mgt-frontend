import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Tabs,
    Tab,
} from '@mui/material';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import BookingList from './BookingList';
import DriverManagement from './DriverManagement';
import { taxiAPI } from '../../services/api';

// Move StatCard component outside
const StatCard = ({ title, value, icon, color }) => (
    <Card className="hover:shadow-lg transition-shadow">
        <CardContent>
            <Box className="flex items-center justify-between">
                <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                        {title}
                    </Typography>
                    <Typography variant="h4" className="font-bold">
                        {value}
                    </Typography>
                </Box>
                <Box className={`p-3 rounded-full bg-${color}-100`}>
                    {icon}
                </Box>
            </Box>
        </CardContent>
    </Card>
);

const TaxiDashboard = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [showCreateBooking, setShowCreateBooking] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [stats, setStats] = useState({
        totalBookings: 0,
        pendingBookings: 0,
        availableDrivers: 0,
        todayRevenue: 0,
    });

    // Fetch statistics
    const fetchStats = async () => {
        try {
            const response = await taxiAPI.getTaxiStats();
            setStats(response.data.data);
        } catch (error) {
            console.error('Error fetching taxi stats:', error);
        }
    };

    useEffect(() => {
        fetchStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshKey]);

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <Box className="p-6 bg-gray-50 min-h-screen">
            <Box className="mb-6 flex justify-between items-center">
                <Typography variant="h4" className="font-bold text-gray-800">
                    Taxi & Transport Services
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setShowCreateBooking(true)}
                >
                    New Booking
                </Button>
            </Box>

            {/* Statistics Cards - NOW WITH REAL DATA */}
            <Grid container spacing={3} className="mb-6">
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Bookings"
                        value={stats.totalBookings}
                        icon={<LocalTaxiIcon className="text-blue-600" fontSize="large" />}
                        color="blue"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Available Drivers"
                        value={stats.availableDrivers}
                        icon={<PersonIcon className="text-green-600" fontSize="large" />}
                        color="green"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Pending Bookings"
                        value={stats.pendingBookings}
                        icon={<PendingActionsIcon className="text-orange-600" fontSize="large" />}
                        color="orange"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Today's Revenue"
                        value={`LKR ${stats.todayRevenue}`}
                        icon={<AttachMoneyIcon className="text-purple-600" fontSize="large" />}
                        color="purple"
                    />
                </Grid>
            </Grid>

            {/* Tabs */}
            <Card>
                <Box className="border-b">
                    <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                        <Tab label="Bookings" />
                        <Tab label="Drivers" />
                    </Tabs>
                </Box>

                <CardContent>
                    {activeTab === 0 && (
                        <BookingList
                            refreshKey={refreshKey}
                            onRefresh={handleRefresh}
                            showCreateBooking={showCreateBooking}
                            setShowCreateBooking={setShowCreateBooking}
                        />
                    )}
                    {activeTab === 1 && (
                        <DriverManagement refreshKey={refreshKey} onRefresh={handleRefresh} />
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default TaxiDashboard;
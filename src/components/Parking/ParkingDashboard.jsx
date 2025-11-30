import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  Tabs,
  Tab,
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import { parkingAPI } from '../../services/api';
import ParkingSlotGrid from './ParkingSlotGrid';
import ParkVehicleForm from './ParkVehicleForm';
import ParkedVehiclesList from './ParkedVehiclesList';
import CreateSlotForm from './CreateSlotForm';
import VehicleLogging from './VehicleLogging';


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

const ParkingDashboard = () => {
  const [stats, setStats] = useState({
    totalSlots: 0,
    availableSlots: 0,
    occupiedSlots: 0,
    parkedVehicles: 0,
  });
  const [openParkDialog, setOpenParkDialog] = useState(false);
  const [openCreateSlotDialog, setOpenCreateSlotDialog] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState(0); // NEW

  const fetchStats = async () => {
    try {
      const response = await parkingAPI.getParkingStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
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
          Vehicle Parking Management
        </Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenCreateSlotDialog(true)}
            className="mr-2"
          >
            Create Slot
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => setOpenParkDialog(true)}
          >
            Park Vehicle
          </Button>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} className="mb-6">
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Slots"
            value={stats.totalSlots}
            icon={<LocalParkingIcon className="text-blue-600" fontSize="large" />}
            color="blue"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Available Slots"
            value={stats.availableSlots}
            icon={<CheckCircleIcon className="text-green-600" fontSize="large" />}
            color="green"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Occupied Slots"
            value={stats.occupiedSlots}
            icon={<BlockIcon className="text-red-600" fontSize="large" />}
            color="red"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Parked Vehicles"
            value={stats.parkedVehicles}
            icon={<DirectionsCarIcon className="text-purple-600" fontSize="large" />}
            color="purple"
          />
        </Grid>
      </Grid>

      {/* Tabs for different views */}
      <Card className="mb-6">
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Parking Slots" />
          <Tab label="Currently Parked" />
          <Tab label="Entry/Exit Logs" />
        </Tabs>
      </Card>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Box>
          <ParkingSlotGrid refreshKey={refreshKey} />
        </Box>
      )}

      {activeTab === 1 && (
        <Box>
          <ParkedVehiclesList refreshKey={refreshKey} onRefresh={handleRefresh} />
        </Box>
      )}

      {activeTab === 2 && (
        <Box>
          <VehicleLogging refreshKey={refreshKey} />
        </Box>
      )}

      {/* Dialogs */}
      <Dialog
        open={openParkDialog}
        onClose={() => setOpenParkDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <ParkVehicleForm
          onClose={() => {
            setOpenParkDialog(false);
            handleRefresh();
          }}
        />
      </Dialog>

      <Dialog
        open={openCreateSlotDialog}
        onClose={() => setOpenCreateSlotDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <CreateSlotForm
          onClose={() => {
            setOpenCreateSlotDialog(false);
            handleRefresh();
          }}
        />
      </Dialog>
    </Box>
  );
};

export default ParkingDashboard;
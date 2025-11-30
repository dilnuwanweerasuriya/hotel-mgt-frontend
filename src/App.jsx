import React, { useState } from 'react';
import { Box, AppBar, Toolbar, Typography, Tabs, Tab, Container } from '@mui/material';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import TaxiDashboard from './components/Taxi/TaxiDashboard';
import ParkingDashboard from './components/parking/ParkingDashboard';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box className="min-h-screen bg-gray-100">
      <AppBar position="static" className="bg-linear-to-r from-blue-600 to-blue-800">
        <Toolbar>
          <Typography variant="h5" className="font-bold grow">
            🏨 Hotel Management System
          </Typography>
        </Toolbar>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          className="bg-blue-700"
          textColor="inherit"
          indicatorColor="secondary"
        >
          <Tab
            icon={<LocalParkingIcon />}
            label="Parking Management"
            className="text-white"
          />
          <Tab
            icon={<LocalTaxiIcon />}
            label="Taxi Services"
            className="text-white"
          />
        </Tabs>
      </AppBar>

      <Container maxWidth="xl" className="py-0">
        {activeTab === 0 && <ParkingDashboard />}
        {activeTab === 1 && <TaxiDashboard />}
      </Container>
    </Box>
  );
}

export default App;
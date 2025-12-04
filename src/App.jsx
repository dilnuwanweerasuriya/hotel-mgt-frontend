import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, Container, Tabs, Tab } from '@mui/material';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/Auth/PrivateRoute';
import Login from './components/Auth/Login';
import Header from './components/Layout/Header';
import ParkingDashboard from './components/Parking/ParkingDashboard';
import TaxiDashboard from './components/Taxi/TaxiDashboard';
import './index.css';

function Dashboard() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box className="min-h-screen bg-gray-100">
      <Header />

      <Box className="bg-blue-400">
        <Container maxWidth="xl">
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
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
        </Container>
      </Box>

      <Container maxWidth="xl" className="py-0 ">
        {activeTab === 0 && <ParkingDashboard />}
        {activeTab === 1 && <TaxiDashboard />}
      </Container>
    </Box>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
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
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { taxiAPI } from '../../services/api';
import CreateBookingForm from './CreateBookingForm';
import AssignDriverDialog from './AssignDriverDialog';
import moment from 'moment';

const BookingList = ({ refreshKey, onRefresh, showCreateBooking, setShowCreateBooking }) => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showAssignDriver, setShowAssignDriver] = useState(false);

  // Define fetchBookings before useEffect using useCallback
  const fetchBookings = useCallback(async () => {
    try {
      const response = await taxiAPI.getAllBookings();
      setBookings(response.data.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [refreshKey, fetchBookings]);

  const handleMenuClick = (event, booking) => {
    setAnchorEl(event.currentTarget);
    setSelectedBooking(booking);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleStatusChange = async (status) => {
    try {
      await taxiAPI.updateBookingStatus(selectedBooking._id, status);
      onRefresh();
      handleMenuClose();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handlePaymentUpdate = async (paymentStatus) => {
    try {
      await taxiAPI.updatePaymentStatus(selectedBooking._id, paymentStatus);
      onRefresh();
      handleMenuClose();
    } catch (error) {
      console.error('Error updating payment:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      confirmed: 'info',
      'in-progress': 'primary',
      completed: 'success',
      cancelled: 'error',
    };
    return colors[status] || 'default';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      paid: 'success',
      refunded: 'error',
    };
    return colors[status] || 'default';
  };

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow className="bg-gray-100">
              <TableCell className="font-bold">Booking ID</TableCell>
              <TableCell className="font-bold">Guest Details</TableCell>
              <TableCell className="font-bold">Route</TableCell>
              <TableCell className="font-bold">Pickup Time</TableCell>
              <TableCell className="font-bold">Vehicle Type</TableCell>
              <TableCell className="font-bold">Driver</TableCell>
              <TableCell className="font-bold">Fare</TableCell>
              <TableCell className="font-bold">Status</TableCell>
              <TableCell className="font-bold">Payment</TableCell>
              <TableCell className="font-bold">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking._id} hover>
                <TableCell className="font-semibold">{booking.bookingId}</TableCell>
                <TableCell>
                  <Typography variant="body2" className="font-semibold">
                    {booking.guestName}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Room: {booking.guestRoom} | {booking.guestPhone}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    <strong>From:</strong> {booking.pickupLocation}
                  </Typography>
                  <Typography variant="body2">
                    <strong>To:</strong> {booking.dropLocation}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {booking.distance} km
                  </Typography>
                </TableCell>
                <TableCell>
                  {moment(booking.pickupTime).format('DD/MM/YY HH:mm')}
                </TableCell>
                <TableCell>
                  <Chip label={booking.vehicleType} size="small" className="capitalize" />
                </TableCell>
                <TableCell>
                  {booking.driver ? (
                    <Box>
                      <Typography variant="body2">{booking.driver.name}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {booking.driver.vehicleNumber}
                      </Typography>
                    </Box>
                  ) : (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowAssignDriver(true);
                      }}
                    >
                      Assign
                    </Button>
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2" className="font-bold">
                    LKR {booking.totalFare}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={booking.status}
                    color={getStatusColor(booking.status)}
                    size="small"
                    className="capitalize"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={booking.paymentStatus}
                    color={getPaymentStatusColor(booking.paymentStatus)}
                    size="small"
                    className="capitalize"
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={(e) => handleMenuClick(e, booking)}>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {bookings.length === 0 && (
        <Box className="text-center py-8">
          <Typography color="textSecondary">No bookings found</Typography>
        </Box>
      )}

      {/* Actions Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleStatusChange('confirmed')}>Mark as Confirmed</MenuItem>
        <MenuItem onClick={() => handleStatusChange('in-progress')}>Mark as In Progress</MenuItem>
        <MenuItem onClick={() => handleStatusChange('completed')}>Mark as Completed</MenuItem>
        <MenuItem onClick={() => handleStatusChange('cancelled')}>Cancel Booking</MenuItem>
        <MenuItem divider />
        <MenuItem onClick={() => handlePaymentUpdate('paid')}>Mark as Paid</MenuItem>
        <MenuItem onClick={() => handlePaymentUpdate('pending')}>Mark as Pending</MenuItem>
      </Menu>

      {/* Create Booking Dialog */}
      <Dialog
        open={showCreateBooking}
        onClose={() => setShowCreateBooking(false)}
        maxWidth="md"
        fullWidth
      >
        <CreateBookingForm
          onClose={() => {
            setShowCreateBooking(false);
            onRefresh();
          }}
        />
      </Dialog>

      {/* Assign Driver Dialog */}
      <Dialog
        open={showAssignDriver}
        onClose={() => setShowAssignDriver(false)}
        maxWidth="sm"
        fullWidth
      >
        <AssignDriverDialog
          booking={selectedBooking}
          onClose={() => {
            setShowAssignDriver(false);
            onRefresh();
          }}
        />
      </Dialog>
    </>
  );
};

export default BookingList;
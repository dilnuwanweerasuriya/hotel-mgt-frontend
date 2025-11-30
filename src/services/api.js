import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Parking APIs
export const parkingAPI = {
  getAllSlots: () => api.get('/parking/slots'),
  getAvailableSlots: (type) => api.get('/parking/slots/available', { params: { type } }),
  createSlot: (data) => api.post('/parking/slots', data),
  parkVehicle: (data) => api.post('/parking/vehicles/park', data),
  getParkedVehicles: () => api.get('/parking/vehicles'),
  getAllVehicleHistory: () => api.get('/parking/vehicles/history'),
  exitVehicle: (vehicleId) => api.put(`/parking/vehicles/${vehicleId}/exit`),
  getParkingStats: () => api.get('/parking/stats'),
};

// Taxi APIs
export const taxiAPI = {
  createBooking: (data) => api.post('/taxi/bookings', data),
  getAllBookings: () => api.get('/taxi/bookings'),
  getBookingById: (id) => api.get(`/taxi/bookings/${id}`),
  updateBookingStatus: (id, status) => api.put(`/taxi/bookings/${id}/status`, { status }),
  assignDriver: (id, driverId) => api.put(`/taxi/bookings/${id}/assign-driver`, { driverId }),
  updatePaymentStatus: (id, paymentStatus) => api.put(`/taxi/bookings/${id}/payment`, { paymentStatus }),
  getAllDrivers: () => api.get('/taxi/drivers'),
  getAvailableDrivers: (vehicleType) => api.get('/taxi/drivers/available', { params: { vehicleType } }),
  createDriver: (data) => api.post('/taxi/drivers', data),
};

export default api;
const API_URL = "http://localhost:5000/api";

/* =====================================================
   COMMON API REQUEST
===================================================== */

const apiRequest = async (endpoint, options = {}) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_URL}${endpoint}`,
      {
        ...options,

        headers: {
          "Content-Type": "application/json",
          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
          ...(options.headers || {}),
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          data.error ||
          "Something went wrong"
      );
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

/* =====================================================
   AUTH
===================================================== */

export const registerUser = (userData) =>
  apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });

export const loginUser = (userData) =>
  apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(userData),
  });

export const getCurrentUser = () =>
  apiRequest("/auth/me");

/* =====================================================
   MATCHES
===================================================== */

export const getMatches = () =>
  apiRequest("/matches");

export const getMatchById = (id) =>
  apiRequest(`/matches/${id}`);

/* =====================================================
   STADIUM
===================================================== */

export const getStadiumById = (id) =>
  apiRequest(`/stadiums/${id}`);

/* =====================================================
   SEATS
===================================================== */

export const getSeats = (stadiumId) =>
  apiRequest(`/seats/stadium/${stadiumId}`);

/* =====================================================
   PARKING
===================================================== */

export const getParkingSlots = (stadiumId) =>
  apiRequest(`/parking/stadium/${stadiumId}`);

export const getAvailableParkingSlots = (
  stadiumId,
  vehicleType
) =>
  apiRequest(
    `/parking/available/${stadiumId}?vehicleType=${vehicleType}`
  );

/* =====================================================
   BOOKINGS
===================================================== */

export const createBooking = (bookingData) =>
  apiRequest("/bookings", {
    method: "POST",
    body: JSON.stringify(bookingData),
  });

export const getMyBookings = () =>
  apiRequest("/bookings/my");

export const getBookingById = (id) =>
  apiRequest(`/bookings/${id}`);

export const cancelBooking = (id) =>
  apiRequest(`/bookings/${id}/cancel`, {
    method: "PUT",
  });

/* =====================================================
   DEFAULT EXPORT
===================================================== */

export default {
  registerUser,
  loginUser,
  getCurrentUser,

  getMatches,
  getMatchById,

  getStadiumById,

  getSeats,

  getParkingSlots,
  getAvailableParkingSlots,

  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
};
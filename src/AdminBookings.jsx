import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import "./AdminBookings.css";

const API_URL =
  "http://localhost:5000/api";

function AdminBookings() {
  const [bookings, setBookings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [selectedBooking, setSelectedBooking] =
    useState(null);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  // ========================================
  // LOAD ALL BOOKINGS
  // ========================================

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Admin authentication is required."
        );
      }

      const response =
        await fetch(
          `${API_URL}/bookings/admin/all`,
          {
            method: "GET",
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to load bookings."
        );
      }

      setBookings(
        Array.isArray(data?.bookings)
          ? data.bookings
          : []
      );
    } catch (err) {
      console.error(
        "Admin bookings error:",
        err
      );

      setError(
        err?.message ||
          "Unable to load bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // INITIAL LOAD
  // ========================================

  useEffect(() => {
    loadBookings();
  }, []);

  // ========================================
  // FORMAT DATE
  // ========================================

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    try {
      return new Date(
        date
      ).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return "—";
    }
  };

  // ========================================
  // FORMAT DATE + TIME
  // ========================================

  const formatDateTime = (
    date
  ) => {
    if (!date) {
      return "—";
    }

    try {
      return new Date(
        date
      ).toLocaleString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      );
    } catch {
      return "—";
    }
  };

  // ========================================
  // GET USER NAME
  // ========================================

  const getUserName = (
    booking
  ) => {
    if (
      booking?.user &&
      typeof booking.user ===
        "object"
    ) {
      return (
        booking.user.name ||
        "Unknown User"
      );
    }

    return "Unknown User";
  };

  // ========================================
  // GET USER EMAIL
  // ========================================

  const getUserEmail = (
    booking
  ) => {
    if (
      booking?.user &&
      typeof booking.user ===
        "object"
    ) {
      return (
        booking.user.email ||
        "—"
      );
    }

    return "—";
  };

  // ========================================
  // GET MATCH NAME
  // ========================================

  const getMatchName = (
    booking
  ) => {
    const match =
      booking?.match;

    if (!match) {
      return "Match unavailable";
    }

    if (
      typeof match ===
      "string"
    ) {
      return match;
    }

    const teamA =
      match?.teamA;

    const teamB =
      match?.teamB;

    const teamAName =
      typeof teamA ===
      "object"
        ? teamA?.shortName ||
          teamA?.name
        : teamA;

    const teamBName =
      typeof teamB ===
      "object"
        ? teamB?.shortName ||
          teamB?.name
        : teamB;

    if (
      teamAName &&
      teamBName
    ) {
      return `${teamAName} vs ${teamBName}`;
    }

    return (
      match?.name ||
      "Match unavailable"
    );
  };

  // ========================================
  // GET STADIUM
  // ========================================

  const getStadiumName = (
    booking
  ) => {
    const match =
      booking?.match;

    if (
      match?.stadium &&
      typeof match.stadium ===
        "object"
    ) {
      return (
        match.stadium.name ||
        "Stadium unavailable"
      );
    }

    if (
      typeof match?.stadium ===
      "string"
    ) {
      return match.stadium;
    }

    return "Stadium unavailable";
  };

  // ========================================
  // GET SEATS
  // ========================================

  const getSeats = (
    booking
  ) => {
    if (
      !Array.isArray(
        booking?.seats
      ) ||
      booking.seats.length === 0
    ) {
      return [];
    }

    return booking.seats
      .map((seat) => {
        if (
          typeof seat ===
          "string"
        ) {
          return seat;
        }

        return (
          seat?.seatNumber ||
          seat?.number ||
          seat?.name ||
          seat?._id ||
          ""
        );
      })
      .filter(Boolean);
  };

  // ========================================
  // GET PARKING
  // ========================================

  const getParking = (
    booking
  ) => {
    const parking =
      booking?.parkingSlot;

    if (!parking) {
      return null;
    }

    if (
      typeof parking ===
      "string"
    ) {
      return {
        slotNumber: parking,
        vehicleType: "",
      };
    }

    return parking;
  };

  // ========================================
  // STATUS CLASS
  // ========================================

  const getStatusClass = (
    status
  ) => {
    if (
      status === "confirmed"
    ) {
      return "confirmed";
    }

    if (
      status === "cancelled"
    ) {
      return "cancelled";
    }

    return "pending";
  };

  // ========================================
  // FILTER BOOKINGS
  // ========================================

  const filteredBookings =
    useMemo(() => {
      const search =
        searchTerm
          .trim()
          .toLowerCase();

      return bookings.filter(
        (booking) => {
          const matchesStatus =
            statusFilter ===
              "all" ||
            booking?.status ===
              statusFilter;

          if (!matchesStatus) {
            return false;
          }

          if (!search) {
            return true;
          }

          const reference =
            String(
              booking?.bookingReference ||
                ""
            ).toLowerCase();

          const userName =
            getUserName(
              booking
            ).toLowerCase();

          const email =
            getUserEmail(
              booking
            ).toLowerCase();

          const matchName =
            getMatchName(
              booking
            ).toLowerCase();

          const stadium =
            getStadiumName(
              booking
            ).toLowerCase();

          return (
            reference.includes(
              search
            ) ||
            userName.includes(
              search
            ) ||
            email.includes(
              search
            ) ||
            matchName.includes(
              search
            ) ||
            stadium.includes(
              search
            )
          );
        }
      );
    }, [
      bookings,
      searchTerm,
      statusFilter,
    ]);

  // ========================================
  // STATISTICS
  // ========================================

  const totalBookings =
    bookings.length;

  const confirmedBookings =
    bookings.filter(
      (booking) =>
        booking?.status ===
        "confirmed"
    ).length;

  const pendingBookings =
    bookings.filter(
      (booking) =>
        booking?.status ===
        "pending"
    ).length;

  const cancelledBookings =
    bookings.filter(
      (booking) =>
        booking?.status ===
        "cancelled"
    ).length;

  const totalRevenue =
    bookings
      .filter(
        (booking) =>
          booking?.status ===
          "confirmed"
      )
      .reduce(
        (total, booking) =>
          total +
          Number(
            booking?.totalAmount ||
              0
          ),
        0
      );

  // ========================================
  // CLEAR FILTERS
  // ========================================

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <section className="admin-bookings-page">

      {/* ====================================
          HEADER
      ==================================== */}

      <div className="admin-bookings-header">

        <div>

          <span className="admin-bookings-label">
            BOOKING MANAGEMENT
          </span>

          <h2>
            All Bookings
          </h2>

          <p>
            View and manage customer
            ticket bookings.
          </p>

        </div>

        <button
          type="button"
          className="admin-bookings-refresh-button"
          onClick={
            loadBookings
          }
          disabled={loading}
        >
          <span>
            ↻
          </span>

          {loading
            ? "Refreshing..."
            : "Refresh"}
        </button>

      </div>

      {/* ====================================
          ERROR
      ==================================== */}

      {error && (
        <div className="admin-bookings-error">
          {error}
        </div>
      )}

      {/* ====================================
          SUCCESS
      ==================================== */}

      {success && (
        <div className="admin-bookings-success">
          {success}
        </div>
      )}

      {/* ====================================
          STATISTICS
      ==================================== */}

      <div className="admin-bookings-stats">

        <article className="admin-booking-stat-card">

          <div className="admin-booking-stat-icon">
            🎟️
          </div>

          <div>

            <strong>
              {totalBookings}
            </strong>

            <span>
              Total Bookings
            </span>

          </div>

        </article>

        <article className="admin-booking-stat-card">

          <div className="admin-booking-stat-icon">
            ✓
          </div>

          <div>

            <strong>
              {confirmedBookings}
            </strong>

            <span>
              Confirmed
            </span>

          </div>

        </article>

        <article className="admin-booking-stat-card">

          <div className="admin-booking-stat-icon">
            ◷
          </div>

          <div>

            <strong>
              {pendingBookings}
            </strong>

            <span>
              Pending
            </span>

          </div>

        </article>

        <article className="admin-booking-stat-card">

          <div className="admin-booking-stat-icon">
            ×
          </div>

          <div>

            <strong>
              {cancelledBookings}
            </strong>

            <span>
              Cancelled
            </span>

          </div>

        </article>

        <article className="admin-booking-stat-card admin-booking-revenue-card">

          <div className="admin-booking-stat-icon">
            ₹
          </div>

          <div>

            <strong>
              ₹
              {totalRevenue.toLocaleString(
                "en-IN"
              )}
            </strong>

            <span>
              Confirmed Revenue
            </span>

          </div>

        </article>

      </div>

      {/* ====================================
          FILTERS
      ==================================== */}

      <div className="admin-bookings-filter-card">

        <div className="admin-bookings-search">

          <span>
            🔎
          </span>

          <input
            type="text"
            value={
              searchTerm
            }
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
            placeholder="Search booking, user, email, match..."
          />

        </div>

        <select
          value={
            statusFilter
          }
          onChange={(event) =>
            setStatusFilter(
              event.target.value
            )
          }
          className="admin-bookings-status-filter"
        >

          <option value="all">
            All Status
          </option>

          <option value="confirmed">
            Confirmed
          </option>

          <option value="pending">
            Pending
          </option>

          <option value="cancelled">
            Cancelled
          </option>

        </select>

        {(searchTerm ||
          statusFilter !==
            "all") && (
          <button
            type="button"
            className="admin-bookings-clear-button"
            onClick={
              clearFilters
            }
          >
            Clear
          </button>
        )}

      </div>

      {/* ====================================
          BOOKING TABLE
      ==================================== */}

      <div className="admin-bookings-card">

        <div className="admin-bookings-card-heading">

          <div>

            <span>
              CUSTOMER BOOKINGS
            </span>

            <h3>
              Booking Records
            </h3>

          </div>

          <div className="admin-bookings-count">
            {filteredBookings.length}
            {" "}
            records
          </div>

        </div>

        {loading ? (

          <div className="admin-bookings-loading">

            <div className="admin-bookings-spinner"></div>

            <p>
              Loading bookings...
            </p>

          </div>

        ) : filteredBookings.length ===
          0 ? (

          <div className="admin-bookings-empty">

            <div>
              🎟️
            </div>

            <h3>
              No bookings found
            </h3>

            <p>
              There are no bookings
              matching your current
              filters.
            </p>

            {(searchTerm ||
              statusFilter !==
                "all") && (
              <button
                type="button"
                onClick={
                  clearFilters
                }
              >
                Clear Filters
              </button>
            )}

          </div>

        ) : (

          <div className="admin-bookings-table-wrapper">

            <table className="admin-bookings-table">

              <thead>

                <tr>

                  <th>
                    Booking
                  </th>

                  <th>
                    Customer
                  </th>

                  <th>
                    Match
                  </th>

                  <th>
                    Seats
                  </th>

                  <th>
                    Parking
                  </th>

                  <th>
                    Total
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Date
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredBookings.map(
                  (booking) => {
                    const seats =
                      getSeats(
                        booking
                      );

                    const parking =
                      getParking(
                        booking
                      );

                    return (
                      <tr
                        key={
                          booking?._id
                        }
                      >

                        {/* BOOKING */}

                        <td>

                          <div className="admin-booking-reference">

                            <strong>
                              {
                                booking?.bookingReference ||
                                "—"
                              }
                            </strong>

                            <small>
                              ID:{" "}
                              {
                                booking?._id
                                  ? String(
                                      booking._id
                                    ).slice(
                                      -8
                                    )
                                  : "—"
                              }
                            </small>

                          </div>

                        </td>

                        {/* CUSTOMER */}

                        <td>

                          <div className="admin-booking-customer">

                            <div className="admin-booking-avatar">
                              {
                                getUserName(
                                  booking
                                )
                                  .charAt(
                                    0
                                  )
                                  .toUpperCase()
                              }
                            </div>

                            <div>

                              <strong>
                                {
                                  getUserName(
                                    booking
                                  )
                                }
                              </strong>

                              <small>
                                {
                                  getUserEmail(
                                    booking
                                  )
                                }
                              </small>

                            </div>

                          </div>

                        </td>

                        {/* MATCH */}

                        <td>

                          <div className="admin-booking-match">

                            <strong>
                              {
                                getMatchName(
                                  booking
                                )
                              }
                            </strong>

                            <small>
                              {
                                getStadiumName(
                                  booking
                                )
                              }
                            </small>

                          </div>

                        </td>

                        {/* SEATS */}

                        <td>

                          <div className="admin-booking-seats">

                            {seats.length >
                            0 ? (
                              seats.map(
                                (
                                  seat,
                                  index
                                ) => (
                                  <span
                                    key={`${seat}-${index}`}
                                  >
                                    {
                                      seat
                                    }
                                  </span>
                                )
                              )
                            ) : (
                              <span className="admin-booking-muted">
                                —
                              </span>
                            )}

                          </div>

                        </td>

                        {/* PARKING */}

                        <td>

                          {parking ? (

                            <div className="admin-booking-parking">

                              <strong>
                                {
                                  parking?.slotNumber ||
                                  parking?.slot ||
                                  "Reserved"
                                }
                              </strong>

                              {parking?.vehicleType && (
                                <small>
                                  {
                                    parking.vehicleType
                                  }
                                </small>
                              )}

                            </div>

                          ) : (

                            <span className="admin-booking-no-parking">
                              No Parking
                            </span>

                          )}

                        </td>

                        {/* TOTAL */}

                        <td>

                          <div className="admin-booking-total">

                            ₹
                            {Number(
                              booking?.totalAmount ||
                                0
                            ).toLocaleString(
                              "en-IN"
                            )}

                          </div>

                        </td>

                        {/* STATUS */}

                        <td>

                          <span
                            className={`admin-booking-status ${getStatusClass(
                              booking?.status
                            )}`}
                          >

                            <span></span>

                            {booking?.status ||
                              "pending"}

                          </span>

                        </td>

                        {/* DATE */}

                        <td>

                          <div className="admin-booking-date">

                            <strong>
                              {
                                formatDate(
                                  booking?.createdAt ||
                                    booking?.bookedAt
                                )
                              }
                            </strong>

                            <small>
                              {
                                booking?.createdAt ||
                                booking?.bookedAt
                                  ? new Date(
                                      booking.createdAt ||
                                        booking.bookedAt
                                    ).toLocaleTimeString(
                                      "en-IN",
                                      {
                                        hour: "2-digit",
                                        minute:
                                          "2-digit",
                                      }
                                    )
                                  : "—"
                              }
                            </small>

                          </div>

                        </td>

                        {/* ACTION */}

                        <td>

                          <button
                            type="button"
                            className="admin-booking-view-button"
                            onClick={() =>
                              setSelectedBooking(
                                booking
                              )
                            }
                          >
                            View
                          </button>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* ====================================
          BOOKING DETAILS MODAL
      ==================================== */}

      {selectedBooking && (

        <div
          className="admin-booking-modal-overlay"
          onClick={() =>
            setSelectedBooking(
              null
            )
          }
        >

          <div
            className="admin-booking-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="admin-booking-modal-header">

              <div>

                <span>
                  BOOKING DETAILS
                </span>

                <h2>
                  {
                    selectedBooking?.bookingReference ||
                    "Booking"
                  }
                </h2>

              </div>

              <button
                type="button"
                className="admin-booking-modal-close"
                onClick={() =>
                  setSelectedBooking(
                    null
                  )
                }
              >
                ×
              </button>

            </div>

            <div className="admin-booking-modal-status-row">

              <span
                className={`admin-booking-status ${getStatusClass(
                  selectedBooking?.status
                )}`}
              >

                <span></span>

                {
                  selectedBooking?.status ||
                  "pending"
                }

              </span>

              <small>
                Created{" "}
                {
                  formatDateTime(
                    selectedBooking?.createdAt ||
                      selectedBooking?.bookedAt
                  )
                }
              </small>

            </div>

            {/* CUSTOMER */}

            <div className="admin-booking-detail-section">

              <h3>
                Customer Information
              </h3>

              <div className="admin-booking-detail-grid">

                <div>

                  <span>
                    Name
                  </span>

                  <strong>
                    {
                      getUserName(
                        selectedBooking
                      )
                    }
                  </strong>

                </div>

                <div>

                  <span>
                    Email
                  </span>

                  <strong>
                    {
                      getUserEmail(
                        selectedBooking
                      )
                    }
                  </strong>

                </div>

              </div>

            </div>

            {/* MATCH */}

            <div className="admin-booking-detail-section">

              <h3>
                Match Information
              </h3>

              <div className="admin-booking-detail-grid">

                <div>

                  <span>
                    Match
                  </span>

                  <strong>
                    {
                      getMatchName(
                        selectedBooking
                      )
                    }
                  </strong>

                </div>

                <div>

                  <span>
                    Stadium
                  </span>

                  <strong>
                    {
                      getStadiumName(
                        selectedBooking
                      )
                    }
                  </strong>

                </div>

                <div>

                  <span>
                    Date
                  </span>

                  <strong>
                    {
                      selectedBooking?.match?.date
                        ? formatDate(
                            selectedBooking.match.date
                          )
                        : "—"
                    }
                  </strong>

                </div>

                <div>

                  <span>
                    Start Time
                  </span>

                  <strong>
                    {
                      selectedBooking?.match?.startTime ||
                      "—"
                    }
                  </strong>

                </div>

              </div>

            </div>

            {/* SEATS */}

            <div className="admin-booking-detail-section">

              <h3>
                Selected Seats
              </h3>

              <div className="admin-booking-modal-seats">

                {getSeats(
                  selectedBooking
                ).length >
                0 ? (
                  getSeats(
                    selectedBooking
                  ).map(
                    (
                      seat,
                      index
                    ) => (
                      <span
                        key={`${seat}-modal-${index}`}
                      >
                        💺 {seat}
                      </span>
                    )
                  )
                ) : (
                  <span>
                    No seats
                  </span>
                )}

              </div>

            </div>

            {/* PARKING */}

            <div className="admin-booking-detail-section">

              <h3>
                Parking
              </h3>

              {getParking(
                selectedBooking
              ) ? (

                <div className="admin-booking-parking-detail">

                  <div>

                    <span>
                      Slot
                    </span>

                    <strong>
                      {
                        getParking(
                          selectedBooking
                        )?.slotNumber ||
                        getParking(
                          selectedBooking
                        )?.slot ||
                        "Reserved"
                      }
                    </strong>

                  </div>

                  <div>

                    <span>
                      Vehicle
                    </span>

                    <strong>
                      {
                        getParking(
                          selectedBooking
                        )?.vehicleType ||
                        "—"
                      }
                    </strong>

                  </div>

                </div>

              ) : (

                <p className="admin-booking-no-parking-detail">
                  No parking selected
                </p>

              )}

            </div>

            {/* PAYMENT */}

            <div className="admin-booking-detail-section">

              <h3>
                Payment Summary
              </h3>

              <div className="admin-booking-payment-summary">

                <div>

                  <span>
                    Ticket Amount
                  </span>

                  <strong>
                    ₹
                    {Number(
                      selectedBooking?.ticketAmount ||
                        0
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>

                <div>

                  <span>
                    Parking Amount
                  </span>

                  <strong>
                    ₹
                    {Number(
                      selectedBooking?.parkingAmount ||
                        0
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>

                <div className="admin-booking-payment-total">

                  <span>
                    Total Amount
                  </span>

                  <strong>
                    ₹
                    {Number(
                      selectedBooking?.totalAmount ||
                        0
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>

              </div>

            </div>

            {/* QR STATUS */}

            <div className="admin-booking-qr-info">

              <span>
                QR TICKET
              </span>

              <strong>
                {selectedBooking?.qrCode
                  ? "QR Code Generated"
                  : "QR Code Not Generated"}
              </strong>

            </div>

            <button
              type="button"
              className="admin-booking-modal-done"
              onClick={() =>
                setSelectedBooking(
                  null
                )
              }
            >
              Close Details
            </button>

          </div>

        </div>

      )}

    </section>
  );
}

export default AdminBookings;
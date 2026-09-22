
import React, { useEffect, useState } from "react";

import Home from "./Home.jsx";
import Matches from "./Matches.jsx";
import Stadiums from "./Stadiums.jsx";
import StadiumDetails from "./StadiumDetails.jsx";
import SeatSelection from "./SeatSelection.jsx";
import Parking from "./Parking.jsx";
import Payment from "./Payment.jsx";
import Ticket from "./Ticket.jsx";
import MyBookings from "./MyBookings.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import Teams from "./Teams.jsx";
import Players from "./Players.jsx";
import AdminLogin from "./AdminLogin.jsx";
import AdminDashboard from "./AdminDashboard.jsx";

const API_URL =
  `${window.location.protocol}//${window.location.hostname}:5000/api`;

function App() {
  /* =====================================================
     PAGE
  ===================================================== */

  const [currentPage, setCurrentPage] =
    useState("home");

  /* =====================================================
     BOOKING DATA
  ===================================================== */

  const [selectedStadium, setSelectedStadium] =
    useState(null);

  const [selectedMatch, setSelectedMatch] =
    useState(null);

  const [bookingData, setBookingData] =
    useState(null);

  const [confirmedBooking, setConfirmedBooking] =
    useState(null);

  /* =====================================================
     QR TICKET LOADING
  ===================================================== */

  const [qrTicketLoading, setQrTicketLoading] =
    useState(false);

  const [qrTicketError, setQrTicketError] =
    useState("");

  /* =====================================================
     SELECTED TEAM
  ===================================================== */

  const [selectedTeam, setSelectedTeam] =
    useState(null);

  /* =====================================================
     AUTH CHECK
  ===================================================== */

  const isLoggedIn = () => {
    const token =
      localStorage.getItem("token");

    return Boolean(token);
  };

  /* =====================================================
     QR TICKET URL

     Example:
     http://192.168.1.5:5173/ticket/CF-ABC123
  ===================================================== */

  useEffect(() => {
    const path =
      window.location.pathname || "";

    const parts =
      path.split("/").filter(Boolean);

    if (
      parts.length === 2 &&
      parts[0].toLowerCase() === "ticket" &&
      parts[1]
    ) {
      const bookingReference =
        decodeURIComponent(parts[1]);

      setCurrentPage("qr-ticket");

      const loadQrTicket = async () => {
        try {
          setQrTicketLoading(true);
          setQrTicketError("");

          const response = await fetch(
            `${API_URL}/bookings/ticket/${encodeURIComponent(
              bookingReference
            )}`
          );

          const data =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data?.message ||
                "Unable to load ticket"
            );
          }

          const ticket =
            data?.booking ||
            data?.ticket ||
            data?.data;

          if (!ticket) {
            throw new Error(
              "Ticket information was not found"
            );
          }

          setConfirmedBooking(ticket);
          setBookingData(ticket);

          if (ticket.match) {
            setSelectedMatch(
              ticket.match
            );

            if (
              ticket.match.stadium
            ) {
              setSelectedStadium(
                ticket.match.stadium
              );
            }
          }

          setCurrentPage(
            "qr-ticket"
          );
        } catch (error) {
          console.error(
            "QR ticket loading error:",
            error
          );

          setQrTicketError(
            error.message ||
              "Unable to load this ticket."
          );
        } finally {
          setQrTicketLoading(false);
        }
      };

      loadQrTicket();
    }
  }, []);

  /* =====================================================
     HOME
  ===================================================== */

  const goHome = () => {
    window.history.pushState(
      {},
      "",
      "/"
    );

    setCurrentPage("home");
  };

  /* =====================================================
     MATCHES
  ===================================================== */

  const goMatches = () => {
    setCurrentPage("matches");
  };

  /* =====================================================
     STADIUMS
  ===================================================== */

  const goStadiums = () => {
    setCurrentPage("stadiums");
  };

  /* =====================================================
     SELECT STADIUM
  ===================================================== */

  const handleStadiumSelect = (
    stadium
  ) => {
    setSelectedStadium(stadium);

    setSelectedMatch(null);

    setBookingData(null);

    setCurrentPage("stadium");
  };

  /* =====================================================
     LOGIN
  ===================================================== */

  const openLogin = () => {
    setCurrentPage("login");
  };

  /* =====================================================
     REGISTER
  ===================================================== */

  const openRegister = () => {
    setCurrentPage("register");
  };

  /* =====================================================
     ADMIN LOGIN
  ===================================================== */

  const openAdminLogin = () => {
    setCurrentPage("admin-login");
  };

  /* =====================================================
     ADMIN LOGIN SUCCESS
  ===================================================== */

  const handleAdminLoginSuccess = () => {
    setCurrentPage(
      "admin-dashboard"
    );
  };

  /* =====================================================
     TEAMS
  ===================================================== */

  const goTeams = () => {
    if (!isLoggedIn()) {
      setCurrentPage("login");

      return;
    }

    setCurrentPage("teams");
  };

  /* =====================================================
     PLAYERS
  ===================================================== */

  const goPlayers = (
    team = null
  ) => {
    setSelectedTeam(team);

    setCurrentPage("players");
  };

  /* =====================================================
     BOOK TICKETS
  ===================================================== */

  const handleStadium = (
    stadium,
    match
  ) => {
    if (!isLoggedIn()) {
      setCurrentPage("login");

      return;
    }

    const preservedMatch = {
      ...match,

      parkingMode:
        match?.parkingMode ||
        "unavailable",
    };

    setSelectedStadium(
      stadium
    );

    setSelectedMatch(
      preservedMatch
    );

    setBookingData({
      stadium: stadium,

      match: preservedMatch,

      parkingMode:
        preservedMatch.parkingMode,
    });

    setCurrentPage(
      "stadium"
    );
  };

  /* =====================================================
     STADIUM → SEATS
  ===================================================== */

  const handleStadiumContinue = (
    stadiumData
  ) => {
    if (!isLoggedIn()) {
      setCurrentPage("login");

      return;
    }

    const currentParkingMode =
      selectedMatch?.parkingMode ||
      bookingData?.parkingMode ||
      "unavailable";

    const currentMatch = {
      ...selectedMatch,

      parkingMode:
        currentParkingMode,
    };

    setSelectedMatch(
      currentMatch
    );

    setBookingData({
      stadium:
        stadiumData,

      match:
        currentMatch,

      parkingMode:
        currentParkingMode,
    });

    setCurrentPage(
      "seats"
    );
  };

  /* =====================================================
     SEATS → PARKING
  ===================================================== */

  const handleSeatsContinue = (
    seatData
  ) => {
    if (!isLoggedIn()) {
      setCurrentPage("login");

      return;
    }

    const currentParkingMode =
      bookingData?.parkingMode ||
      selectedMatch?.parkingMode ||
      "unavailable";

    const currentMatch = {
      ...(bookingData?.match ||
        selectedMatch),

      parkingMode:
        currentParkingMode,
    };

    let seats = [];

    if (
      Array.isArray(seatData?.seats) &&
      seatData.seats.length > 0
    ) {
      seats = seatData.seats;
    } else if (
      Array.isArray(bookingData?.seats) &&
      bookingData.seats.length > 0
    ) {
      seats = bookingData.seats;
    } else {
      try {
        const matchId =
          currentMatch?._id ||
          currentMatch?.id ||
          currentMatch?.matchId ||
          "unknown";

        const storageKey =
          `cricfusion_selected_seats_${String(
            matchId
          )}`;

        const storedSeats =
          sessionStorage.getItem(
            storageKey
          );

        if (storedSeats) {
          const parsedSeats =
            JSON.parse(storedSeats);

          if (
            Array.isArray(parsedSeats) &&
            parsedSeats.length > 0
          ) {
            seats = parsedSeats;
          }
        }
      } catch (error) {
        console.error(
          "Unable to restore selected seats:",
          error
        );
      }
    }

    const seatIds =
      Array.isArray(seatData?.seatIds) &&
      seatData.seatIds.length > 0
        ? seatData.seatIds
        : seats
            .map(
              (seat) =>
                seat?._id ||
                seat?.id ||
                seat?.seatId
            )
            .filter(Boolean);

    const seatTotal =
      seatData?.seatTotal !== undefined
        ? Number(
            seatData.seatTotal
          )
        : seats.reduce(
            (total, seat) =>
              total +
              Number(
                seat?.price || 0
              ),
            0
          );

    const newBookingData = {
      ...bookingData,

      ...seatData,

      match:
        currentMatch,

      parkingMode:
        currentParkingMode,

      seats:
        seats,

      seatIds:
        seatIds,

      seatTotal:
        seatTotal,

      total:
        seatData?.total !== undefined
          ? Number(
              seatData.total
            )
          : seatTotal,

      lockedUntil:
        seatData?.lockedUntil ||
        bookingData?.lockedUntil ||
        null,
    };

    setBookingData(
      newBookingData
    );

    setCurrentPage(
      "parking"
    );
  };

  /* =====================================================
     PARKING → PAYMENT
  ===================================================== */

  const handleParkingContinue = (
    parkingData
  ) => {
    if (!isLoggedIn()) {
      setCurrentPage("login");

      return;
    }

    setBookingData(
      (previousData) => ({
        ...previousData,

        ...parkingData,

        match:
          parkingData?.match ||
          previousData?.match ||
          selectedMatch,

        parkingMode:
          parkingData?.parkingMode ||
          previousData?.parkingMode ||
          selectedMatch?.parkingMode ||
          "unavailable",
      })
    );

    setCurrentPage(
      "payment"
    );
  };

  /* =====================================================
     PAYMENT → PARKING
  ===================================================== */

  const handlePaymentBack = () => {
    if (!isLoggedIn()) {
      setCurrentPage("login");

      return;
    }

    setCurrentPage("parking");
  };

  /* =====================================================
     PAYMENT SUCCESS → TICKET
  ===================================================== */

  const handlePaymentSuccess = (
    booking
  ) => {
    setConfirmedBooking(
      booking
    );

    setCurrentPage(
      "ticket"
    );
  };

  /* =====================================================
     TICKET → HOME
  ===================================================== */

  const handleTicketHome = () => {
    window.history.pushState(
      {},
      "",
      "/"
    );

    setCurrentPage("home");

    setBookingData(null);

    setConfirmedBooking(null);

    setSelectedMatch(null);

    setSelectedStadium(null);
  };

  /* =====================================================
     MY BOOKINGS
  ===================================================== */

  const handleMyBookings = () => {
    if (!isLoggedIn()) {
      setCurrentPage("login");

      return;
    }

    setCurrentPage(
      "mybookings"
    );
  };

  /* =====================================================
     VIEW TICKET
  ===================================================== */

  const handleViewTicket = (
    booking
  ) => {
    if (!isLoggedIn()) {
      setCurrentPage("login");

      return;
    }

    setConfirmedBooking(
      booking
    );

    setCurrentPage(
      "ticket"
    );
  };

  /* =====================================================
     LOGIN SUCCESS
  ===================================================== */

  const handleLoginSuccess = () => {
    setCurrentPage("home");
  };

  /* =====================================================
     QR TICKET PAGE

     IMPORTANT:
     NO LOGIN REQUIRED.
  ===================================================== */

  if (
    currentPage === "qr-ticket"
  ) {
    if (qrTicketLoading) {
      return (
        <div
          style={{
            minHeight: "100vh",
            background: "#000",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
          }}
        >
          Loading your CricFusion ticket...
        </div>
      );
    }

    if (qrTicketError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            background: "#000",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "30px",
          }}
        >
          <h2>
            Ticket Not Found
          </h2>

          <p>
            {qrTicketError}
          </p>

          <button
            type="button"
            onClick={() => {
              window.history.pushState(
                {},
                "",
                "/"
              );

              setCurrentPage(
                "home"
              );
            }}
            style={{
              marginTop: "20px",
              padding:
                "12px 24px",
              border: "none",
              borderRadius:
                "8px",
              cursor: "pointer",
            }}
          >
            Back to CricFusion
          </button>
        </div>
      );
    }

    return (
      <Ticket
        booking={
          confirmedBooking
        }

        bookingData={
          confirmedBooking
        }

        onHome={
          handleTicketHome
        }

        onMyBookings={
          handleMyBookings
        }
      />
    );
  }

  /* =====================================================
     HOME
  ===================================================== */

  if (
    currentPage === "home"
  ) {
    return (
      <Home
        onLogin={
          openLogin
        }

        onRegister={
          openRegister
        }

        onMatches={
          goMatches
        }

        onTeams={
          goTeams
        }

        onPlayers={
          goPlayers
        }

        onStadiums={
          goStadiums
        }

        onAdminLogin={
          openAdminLogin
        }

        onMyBookings={
          handleMyBookings
        }
      />
    );
  }

  /* =====================================================
     MATCHES
  ===================================================== */

  if (
    currentPage === "matches"
  ) {
    return (
      <Matches
        onBackToHome={
          goHome
        }

        onStadium={
          handleStadium
        }

        onTeams={
          goTeams
        }

        onPlayers={
          goPlayers
        }

        onStadiums={
          goStadiums
        }
      />
    );
  }

  /* =====================================================
     STADIUMS
  ===================================================== */

  if (
    currentPage === "stadiums"
  ) {
    return (
      <Stadiums
        onHome={
          goHome
        }

        onSelectStadium={
          handleStadiumSelect
        }

        onMatches={
          goMatches
        }

        onTeams={
          goTeams
        }

        onPlayers={
          goPlayers
        }
      />
    );
  }

  /* =====================================================
     LOGIN
  ===================================================== */

  if (
    currentPage === "login"
  ) {
    return (
      <Login
        onBackToHome={
          goHome
        }

        onRegister={
          openRegister
        }

        onLoginSuccess={
          handleLoginSuccess
        }
      />
    );
  }

  /* =====================================================
     REGISTER
  ===================================================== */

  if (
    currentPage === "register"
  ) {
    return (
      <Register
        onBackToHome={
          goHome
        }

        onLogin={
          openLogin
        }
      />
    );
  }

  /* =====================================================
     ADMIN LOGIN
  ===================================================== */

  if (
    currentPage === "admin-login"
  ) {
    return (
      <AdminLogin
        onBackToHome={
          goHome
        }

        onAdminLoginSuccess={
          handleAdminLoginSuccess
        }
      />
    );
  }

  /* =====================================================
     ADMIN DASHBOARD
  ===================================================== */

  if (
    currentPage === "admin-dashboard"
  ) {
    return (
      <AdminDashboard
        onLogout={() => {
          localStorage.removeItem(
            "token"
          );

          localStorage.removeItem(
            "user"
          );

          localStorage.removeItem(
            "isAdmin"
          );

          setCurrentPage(
            "home"
          );
        }}

        onHome={
          goHome
        }
      />
    );
  }

  /* =====================================================
     TEAMS
  ===================================================== */

  if (
    currentPage === "teams"
  ) {
    if (!isLoggedIn()) {
      return (
        <Login
          onBackToHome={
            goHome
          }

          onRegister={
            openRegister
          }

          onLoginSuccess={
            handleLoginSuccess
          }
        />
      );
    }

    return (
      <Teams
        onHome={
          goHome
        }

        onPlayers={
          goPlayers
        }

        onMatches={
          goMatches
        }

        onStadiums={
          goStadiums
        }
      />
    );
  }

  /* =====================================================
     PLAYERS
  ===================================================== */

  if (
    currentPage === "players"
  ) {
    return (
      <Players
        onHome={
          goHome
        }

        onTeams={
          goTeams
        }

        onMatches={
          goMatches
        }

        onStadiums={
          goStadiums
        }

        selectedTeam={
          selectedTeam
        }
      />
    );
  }

  /* =====================================================
     STADIUM
  ===================================================== */

  if (
    currentPage === "stadium"
  ) {
    return (
      <StadiumDetails
        stadium={
          selectedStadium
        }

        match={
          selectedMatch
        }

        onBack={() => {
          if (selectedMatch) {
            goMatches();
          } else {
            goStadiums();
          }
        }}

        onContinue={
          handleStadiumContinue
        }

        onSeatSelectionComplete={
          handleSeatsContinue
        }
      />
    );
  }

  /* =====================================================
     SEATS
  ===================================================== */

  if (
    currentPage === "seats"
  ) {
    if (!isLoggedIn()) {
      return (
        <Login
          onBackToHome={
            goHome
          }

          onRegister={
            openRegister
          }

          onLoginSuccess={
            handleLoginSuccess
          }
        />
      );
    }

    return (
      <SeatSelection
        match={
          selectedMatch ||
          bookingData?.match
        }

        stadium={
          selectedStadium
        }

        bookingData={
          bookingData
        }

        onBack={() =>
          setCurrentPage(
            "stadium"
          )
        }

        onContinue={
          handleSeatsContinue
        }
      />
    );
  }

  /* =====================================================
     PARKING
  ===================================================== */

  if (
    currentPage === "parking"
  ) {
    if (!isLoggedIn()) {
      return (
        <Login
          onBackToHome={
            goHome
          }

          onRegister={
            openRegister
          }

          onLoginSuccess={
            handleLoginSuccess
          }
        />
      );
    }

    const parkingMatch =
      bookingData?.match ||
      selectedMatch;

    return (
      <Parking
        match={
          parkingMatch
        }

        stadium={
          selectedStadium
        }

        selectedSeats={
          bookingData?.seats ||
          []
        }

        bookingData={
          bookingData
        }

        onBack={() =>
          setCurrentPage(
            "seats"
          )
        }

        onContinue={
          handleParkingContinue
        }
      />
    );
  }

  /* =====================================================
     PAYMENT
  ===================================================== */

  if (
    currentPage === "payment"
  ) {
    if (!isLoggedIn()) {
      return (
        <Login
          onBackToHome={
            goHome
          }

          onRegister={
            openRegister
          }

          onLoginSuccess={
            handleLoginSuccess
          }
        />
      );
    }

    return (
      <Payment
        match={
          selectedMatch
        }

        bookingData={
          bookingData
        }

        onBack={
          handlePaymentBack
        }

        onSuccess={
          handlePaymentSuccess
        }
      />
    );
  }

  /* =====================================================
     NORMAL TICKET
  ===================================================== */

  if (
    currentPage === "ticket"
  ) {
    if (!isLoggedIn()) {
      return (
        <Login
          onBackToHome={
            goHome
          }

          onRegister={
            openRegister
          }

          onLoginSuccess={
            handleLoginSuccess
          }
        />
      );
    }

    return (
      <Ticket
        booking={
          confirmedBooking
        }

        bookingData={
          bookingData
        }

        onHome={
          handleTicketHome
        }

        onMyBookings={
          handleMyBookings
        }
      />
    );
  }

  /* =====================================================
     MY BOOKINGS
  ===================================================== */

  if (
    currentPage === "mybookings"
  ) {
    if (!isLoggedIn()) {
      return (
        <Login
          onBackToHome={
            goHome
          }

          onRegister={
            openRegister
          }

          onLoginSuccess={
            handleLoginSuccess
          }
        />
      );
    }

    return (
      <MyBookings
        onHome={
          goHome
        }

        onViewTicket={
          handleViewTicket
        }
      />
    );
  }

  /* =====================================================
     FALLBACK
  ===================================================== */

  return (
    <Home
      onLogin={
        openLogin
      }

      onRegister={
        openRegister
      }

      onMatches={
        goMatches
      }

      onTeams={
        goTeams
      }

      onPlayers={
        goPlayers
      }

      onStadiums={
        goStadiums
      }

      onAdminLogin={
        openAdminLogin
      }

      onMyBookings={
        handleMyBookings
      }
    />
  );
}

export default App;

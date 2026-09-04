import React, { useState } from "react";

import Home from "./Home.jsx";
import Matches from "./Matches.jsx";
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
     AUTH CHECK
  ===================================================== */

  const isLoggedIn = () => {

    const token =
      localStorage.getItem("token");

    return Boolean(token);
  };


  /* =====================================================
     HOME
  ===================================================== */

  const goHome = () => {

    setCurrentPage("home");

  };


  /* =====================================================
     MATCHES
     AVAILABLE WITHOUT LOGIN
  ===================================================== */

  const goMatches = () => {

    setCurrentPage("matches");

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
     TEAMS
     LOGIN REQUIRED
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
     LOGIN REQUIRED
  ===================================================== */

  const goPlayers = () => {

    if (!isLoggedIn()) {

      setCurrentPage("login");

      return;
    }

    setCurrentPage("players");

  };


  /* =====================================================
     BOOK TICKETS
     LOGIN REQUIRED
  ===================================================== */

  const handleStadium = (
    stadium,
    match
  ) => {

    if (!isLoggedIn()) {

      setCurrentPage("login");

      return;
    }


    setSelectedStadium(
      stadium
    );

    setSelectedMatch(
      match
    );

    setCurrentPage(
      "stadium"
    );

  };


  /* =====================================================
     STADIUM → SEATS
     LOGIN REQUIRED
  ===================================================== */

  const handleStadiumContinue = (
    stadiumData
  ) => {

    if (!isLoggedIn()) {

      setCurrentPage("login");

      return;
    }


    setBookingData({

      stadium:
        stadiumData,

      match:
        selectedMatch,

    });


    setCurrentPage("seats");

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


    setBookingData(
      (previousData) => ({
        ...previousData,
        ...seatData,
      })
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


    setCurrentPage(
      "parking"
    );

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

    setCurrentPage(
      "home"
    );

    setBookingData(
      null
    );

    setConfirmedBooking(
      null
    );

    setSelectedMatch(
      null
    );

    setSelectedStadium(
      null
    );

  };


  /* =====================================================
     MY BOOKINGS
     LOGIN REQUIRED
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
     LOGIN REQUIRED
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

    setCurrentPage(
      "home"
    );

  };


  /* =====================================================
     HOME PAGE

     HOME REMAINS AVAILABLE WITHOUT LOGIN.
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
      />
    );

  }


  /* =====================================================
     MATCHES PAGE

     AVAILABLE WITHOUT LOGIN.
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

      />
    );

  }


  /* =====================================================
     LOGIN PAGE
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
     REGISTER PAGE
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
     TEAMS

     LOGIN REQUIRED
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

      />
    );

  }


  /* =====================================================
     PLAYERS

     LOGIN REQUIRED
  ===================================================== */

  if (
    currentPage === "players"
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
      <Players

        onHome={
          goHome
        }

        onTeams={
          goTeams
        }

      />
    );

  }


  /* =====================================================
     STADIUM

     LOGIN REQUIRED
  ===================================================== */

  if (
    currentPage === "stadium"
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
      <StadiumDetails

        stadium={
          selectedStadium
        }

        match={
          selectedMatch
        }

        onBack={
          goMatches
        }

        onContinue={
          handleStadiumContinue
        }

      />
    );

  }


  /* =====================================================
     SEATS

     LOGIN REQUIRED
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
          selectedMatch
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

     LOGIN REQUIRED
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


    return (
      <Parking

        match={
          selectedMatch
        }

        stadium={
          selectedStadium
        }

        selectedSeats={
          bookingData?.seats || []
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

     LOGIN REQUIRED
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
     TICKET

     LOGIN REQUIRED
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

     LOGIN REQUIRED
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

    />
  );

}


export default App;
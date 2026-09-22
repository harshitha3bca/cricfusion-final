const mongoose = require("mongoose");
const crypto = require("crypto");
const QRCode = require("qrcode");

const Booking = require("../models/Booking");
const Match = require("../models/Match");
const Seat = require("../models/Seat");
const Parking = require("../models/Parking");

/* =====================================================
   BOOKING REFERENCE
===================================================== */

const generateBookingReference =
  () => {
    return (
      "CF-" +
      crypto
        .randomBytes(4)
        .toString("hex")
        .toUpperCase()
    );
  };

/* =====================================================
   MATCH POPULATION
===================================================== */

const matchPopulate = {
  path: "match",
  populate: [
    {
      path: "teamA",
      select:
        "name shortName logo image",
    },
    {
      path: "teamB",
      select:
        "name shortName logo image",
    },
    {
      path: "stadium",
      select:
        "name address",
    },
    {
      path: "tournament",
      select:
        "name",
    },
  ],
};

/* =====================================================
   CREATE BOOKING
===================================================== */

const createBooking =
  async (
    req,
    res
  ) => {
    try {
      const {
        matchId,
        seatIds,
        parkingId,
      } = req.body;

      if (
        !matchId ||
        !Array.isArray(
          seatIds
        ) ||
        seatIds.length === 0
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Match and seats are required",
          });
      }

      if (
        !mongoose.Types.ObjectId.isValid(
          matchId
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Invalid match ID",
          });
      }

      const match =
        await Match.findById(
          matchId
        )
          .populate(
            "teamA"
          )
          .populate(
            "teamB"
          )
          .populate(
            "stadium"
          )
          .populate(
            "tournament"
          );

      if (!match) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Match not found",
          });
      }

      const seats =
        await Seat.find({
          _id: {
            $in: seatIds,
          },
          match: matchId,
        });

      if (
        seats.length !==
        seatIds.length
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "One or more selected seats are invalid",
          });
      }

      const now =
        new Date();

      for (
        const seat of seats
      ) {
        if (
          seat.status !==
          "locked"
        ) {
          return res
            .status(409)
            .json({
              success: false,
              message:
                "One or more seats are not locked",
            });
        }

        if (
          String(
            seat.lockedBy
          ) !==
          String(
            req.user._id
          )
        ) {
          return res
            .status(409)
            .json({
              success: false,
              message:
                "One or more seats are not locked by you or their lock has expired",
            });
        }

        if (
          !seat.lockedUntil ||
          new Date(
            seat.lockedUntil
          ) <= now
        ) {
          return res
            .status(409)
            .json({
              success: false,
              message:
                "One or more seats are not locked by you or their lock has expired",
            });
        }
      }

      /* =================================================
         TICKET AMOUNT
      ================================================= */

      const ticketAmount =
        seats.reduce(
          (
            total,
            seat
          ) =>
            total +
            Number(
              seat.price || 0
            ),
          0
        );

      /* =================================================
         PARKING
      ================================================= */

      let parking =
        null;

      let parkingAmount =
        0;

      if (parkingId) {
        parking =
          await Parking.findById(
            parkingId
          );

        if (!parking) {
          return res
            .status(404)
            .json({
              success: false,
              message:
                "Parking slot not found",
            });
        }

        if (
          parking.status !==
          "reserved"
        ) {
          return res
            .status(409)
            .json({
              success: false,
              message:
                "Parking slot is not reserved",
            });
        }

        if (
          String(
            parking.bookedBy
          ) !==
          String(
            req.user._id
          )
        ) {
          return res
            .status(409)
            .json({
              success: false,
              message:
                "Parking slot is not reserved by you",
            });
        }

        if (
          parking.bookedForMatch &&
          String(
            parking.bookedForMatch
          ) !==
            String(
              matchId
            )
        ) {
          return res
            .status(409)
            .json({
              success: false,
              message:
                "Parking slot does not belong to this match",
            });
        }

        parkingAmount =
          Number(
            parking.price || 0
          );
      }

      /* =================================================
         TOTAL
      ================================================= */

      const totalAmount =
        ticketAmount +
        parkingAmount;

      /* =================================================
         BOOKING
      ================================================= */

      const booking =
        await Booking.create({
          bookingReference:
            generateBookingReference(),

          user:
            req.user._id,

          match:
            matchId,

          seats:
            seatIds,

          parkingSlot:
            parkingId ||
            null,

          ticketAmount,

          parkingAmount,

          totalAmount,

          status:
            "pending",

          qrCode:
            "",
        });

      const populatedBooking =
        await Booking.findById(
          booking._id
        )
          .populate(
            matchPopulate
          )
          .populate(
            "seats"
          )
          .populate(
            "parkingSlot"
          );

      return res
        .status(201)
        .json({
          success: true,
          message:
            "Booking created successfully",
          booking:
            populatedBooking,
        });
    } catch (error) {
      console.error(
        "Create booking error:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,
          message:
            "Unable to create booking",
          error:
            error.message,
        });
    }
  };

/* =====================================================
   CONFIRM BOOKING
===================================================== */

const confirmBooking =
  async (
    req,
    res
  ) => {
    try {
      const {
        id,
      } = req.params;

      const booking =
        await Booking.findById(
          id
        );

      if (!booking) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Booking not found",
          });
      }

      if (
        String(
          booking.user
        ) !==
        String(
          req.user._id
        )
      ) {
        return res
          .status(403)
          .json({
            success: false,
            message:
              "You are not allowed to confirm this booking",
          });
      }

      if (
        booking.status ===
        "confirmed"
      ) {
        const alreadyConfirmed =
          await Booking.findById(
            booking._id
          )
            .populate(
              matchPopulate
            )
            .populate(
              "seats"
            )
            .populate(
              "parkingSlot"
            );

        return res
          .status(200)
          .json({
            success: true,
            message:
              "Booking already confirmed",
            booking:
              alreadyConfirmed,
          });
      }

      if (
        booking.status ===
        "cancelled"
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Cancelled booking cannot be confirmed",
          });
      }

      const now =
        new Date();

      const seats =
        await Seat.find({
          _id: {
            $in:
              booking.seats,
          },
        });

      if (
        seats.length !==
        booking.seats.length
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "One or more seats could not be found",
          });
      }

      /* =================================================
         VERIFY SEAT LOCKS
      ================================================= */

      for (
        const seat of seats
      ) {
        if (
          seat.status !==
          "locked"
        ) {
          return res
            .status(409)
            .json({
              success: false,
              message:
                "One or more seats are no longer locked",
            });
        }

        if (
          String(
            seat.lockedBy
          ) !==
          String(
            req.user._id
          )
        ) {
          return res
            .status(409)
            .json({
              success: false,
              message:
                "One or more seats are not locked by you or their lock has expired",
            });
        }

        if (
          !seat.lockedUntil ||
          new Date(
            seat.lockedUntil
          ) <= now
        ) {
          return res
            .status(409)
            .json({
              success: false,
              message:
                "One or more seats are not locked by you or their lock has expired",
            });
        }
      }

      /* =================================================
         CONFIRM BOOKING
      ================================================= */

      booking.status =
        "confirmed";

      await booking.save();

      /* =================================================
         BOOK SEATS
      ================================================= */

      const seatUpdate =
        await Seat.updateMany(
          {
            _id: {
              $in:
                booking.seats,
            },

            status:
              "locked",

            lockedBy:
              req.user._id,
          },
          {
            $set: {
              status:
                "booked",

              lockedBy:
                null,

              lockedUntil:
                null,
            },
          }
        );

      if (
        seatUpdate.modifiedCount !==
        booking.seats.length
      ) {
        return res
          .status(409)
          .json({
            success: false,
            message:
              "Unable to confirm all selected seats",
          });
      }

      /* =================================================
         PARKING
      ================================================= */

      if (
        booking.parkingSlot
      ) {
        const parking =
          await Parking.findById(
            booking.parkingSlot
          );

        if (
          parking
        ) {
          parking.status =
            "occupied";

          await parking.save();
        }
      }

      /* =================================================
         GET FULL BOOKING
      ================================================= */

      let confirmedBooking =
        await Booking.findById(
          booking._id
        )
          .populate(
            matchPopulate
          )
          .populate(
            "seats"
          )
          .populate(
            "parkingSlot"
          );

      /* =================================================
         FRONTEND TICKET URL
         
         This URL is stored inside the QR code.
      ================================================= */

      const frontendUrl =
        process.env.FRONTEND_URL ||
        `${req.protocol}://${req.get(
          "host"
        ).replace(
          ":5000",
          ":5173"
        )}`;

      const ticketUrl =
        `${frontendUrl}/ticket/${encodeURIComponent(
          confirmedBooking.bookingReference
        )}`;

      /* =================================================
         GENERATE QR
      ================================================= */

      const qrCode =
        await QRCode.toDataURL(
          ticketUrl,
          {
            width:
              500,

            margin:
              2,

            errorCorrectionLevel:
              "H",
          }
        );

      booking.qrCode =
        qrCode;

      await booking.save();

      /* =================================================
         LOAD FINAL BOOKING AGAIN
      ================================================= */

      confirmedBooking =
        await Booking.findById(
          booking._id
        )
          .populate(
            matchPopulate
          )
          .populate(
            "seats"
          )
          .populate(
            "parkingSlot"
          );

      return res
        .status(200)
        .json({
          success: true,

          message:
            "Booking confirmed successfully",

          booking:
            confirmedBooking,
        });
    } catch (error) {
      console.error(
        "Confirm booking error:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,
          message:
            "Unable to confirm booking",
          error:
            error.message,
        });
    }
  };

/* =====================================================
   MY BOOKINGS
===================================================== */

const getMyBookings =
  async (
    req,
    res
  ) => {
    try {
      const bookings =
        await Booking.find({
          user:
            req.user._id,
        })
          .populate(
            matchPopulate
          )
          .populate(
            "seats"
          )
          .populate(
            "parkingSlot"
          )
          .sort({
            createdAt:
              -1,
          });

      return res
        .status(200)
        .json({
          success: true,
          bookings,
        });
    } catch (error) {
      console.error(
        "Get my bookings error:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,
          message:
            "Unable to fetch bookings",
          error:
            error.message,
        });
    }
  };

/* =====================================================
   GET BOOKING BY ID
===================================================== */

const getBookingById =
  async (
    req,
    res
  ) => {
    try {
      const booking =
        await Booking.findById(
          req.params.id
        )
          .populate(
            matchPopulate
          )
          .populate(
            "seats"
          )
          .populate(
            "parkingSlot"
          );

      if (!booking) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Booking not found",
          });
      }

      if (
        String(
          booking.user
        ) !==
        String(
          req.user._id
        )
      ) {
        return res
          .status(403)
          .json({
            success: false,
            message:
              "You are not allowed to view this booking",
          });
      }

      return res
        .status(200)
        .json({
          success: true,
          booking,
        });
    } catch (error) {
      console.error(
        "Get booking error:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,
          message:
            "Unable to fetch booking",
          error:
            error.message,
        });
    }
  };

/* =====================================================
   CANCEL BOOKING
===================================================== */

const cancelBooking =
  async (
    req,
    res
  ) => {
    try {
      const booking =
        await Booking.findById(
          req.params.id
        );

      if (!booking) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Booking not found",
          });
      }

      if (
        String(
          booking.user
        ) !==
        String(
          req.user._id
        )
      ) {
        return res
          .status(403)
          .json({
            success: false,
            message:
              "You are not allowed to cancel this booking",
          });
      }

      if (
        booking.status ===
        "cancelled"
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Booking is already cancelled",
          });
      }

      if (
        booking.status ===
        "confirmed"
      ) {
        await Seat.updateMany(
          {
            _id: {
              $in:
                booking.seats,
            },
          },
          {
            $set: {
              status:
                "available",

              lockedBy:
                null,

              lockedUntil:
                null,
            },
          }
        );

        if (
          booking.parkingSlot
        ) {
          await Parking.findByIdAndUpdate(
            booking.parkingSlot,
            {
              $set: {
                status:
                  "available",

                bookedBy:
                  null,

                bookedForMatch:
                  null,
              },
            }
          );
        }
      }

      booking.status =
        "cancelled";

      await booking.save();

      return res
        .status(200)
        .json({
          success: true,
          message:
            "Booking cancelled successfully",
          booking,
        });
    } catch (error) {
      console.error(
        "Cancel booking error:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,
          message:
            "Unable to cancel booking",
          error:
            error.message,
        });
    }
  };

/* =====================================================
   ADMIN - ALL BOOKINGS
===================================================== */

const getAllBookings =
  async (
    req,
    res
  ) => {
    try {
      const bookings =
        await Booking.find({})
          .populate(
            {
              path: "user",
              select:
                "name email",
            }
          )
          .populate(
            matchPopulate
          )
          .populate(
            "seats"
          )
          .populate(
            "parkingSlot"
          )
          .sort({
            createdAt:
              -1,
          });

      return res
        .status(200)
        .json({
          success: true,
          bookings,
        });
    } catch (error) {
      console.error(
        "Get all bookings error:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,
          message:
            "Unable to fetch all bookings",
          error:
            error.message,
        });
    }
  };

/* =====================================================
   PUBLIC QR TICKET
===================================================== */

const getPublicTicketByReference =
  async (
    req,
    res
  ) => {
    try {
      const {
        bookingReference,
      } = req.params;

      const booking =
        await Booking.findOne({
          bookingReference:
            bookingReference,

          status:
            "confirmed",
        })
          .populate(
            matchPopulate
          )
          .populate(
            "seats"
          )
          .populate(
            "parkingSlot"
          );

      if (!booking) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Confirmed ticket not found",
          });
      }

      return res
        .status(200)
        .json({
          success: true,
          booking,
        });
    } catch (error) {
      console.error(
        "Public ticket error:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,
          message:
            "Unable to load ticket",
          error:
            error.message,
        });
    }
  };

/* =====================================================
   EXPORTS
===================================================== */

module.exports = {
  createBooking,
  confirmBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  getPublicTicketByReference,
};
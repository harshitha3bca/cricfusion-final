const express = require("express");

const {
  getTournaments,
  getTournamentById,
  createTournament,
  updateTournament,
  deleteTournament,
} = require("../controllers/tournamentController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ========================================
// PUBLIC ROUTES
// ========================================

router.get("/", getTournaments);

router.get("/:id", getTournamentById);

// ========================================
// ADMIN ROUTES
// ========================================

router.post(
  "/",
  protect,
  adminOnly,
  createTournament
);

router.put(
  "/:id",
  protect,
  adminOnly,
  updateTournament
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteTournament
);

module.exports = router;
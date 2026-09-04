const express = require("express");

const {
  getTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
} = require("../controllers/teamController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ========================================
// PUBLIC ROUTES
// ========================================

router.get("/", getTeams);

router.get("/:id", getTeamById);

// ========================================
// ADMIN ROUTES
// ========================================

router.post(
  "/",
  protect,
  adminOnly,
  createTeam
);

router.put(
  "/:id",
  protect,
  adminOnly,
  updateTeam
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteTeam
);

module.exports = router;
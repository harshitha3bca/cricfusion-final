const express = require("express");

const {
  getPlayers,
  getPlayersByTeam,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer,
} = require("../controllers/playerController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Public
router.get("/", getPlayers);

router.get("/team/:teamId", getPlayersByTeam);

router.get("/:id", getPlayerById);

// Admin
router.post(
  "/",
  protect,
  adminOnly,
  createPlayer
);

router.put(
  "/:id",
  protect,
  adminOnly,
  updatePlayer
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deletePlayer
);

module.exports = router;
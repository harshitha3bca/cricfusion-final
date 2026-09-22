const getDashboardStats = async (req, res) => {
  try {
    const db = req.app.locals.db;

    if (!db) {
      return res.status(500).json({
        success: false,
        message: "Database connection is not available.",
      });
    }

    const [
      totalUsers,
      totalMatches,
      totalTeams,
      totalPlayers,
      totalStadiums,
      totalSeats,
      totalParkingSlots,
      totalBookings,
    ] = await Promise.all([
      db.collection("users").countDocuments(),
      db.collection("matches").countDocuments(),
      db.collection("teams").countDocuments(),
      db.collection("players").countDocuments(),
      db.collection("stadia").countDocuments(),
      db.collection("seats").countDocuments(),
      db.collection("parkings").countDocuments(),
      db.collection("bookings").countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalMatches,
        totalTeams,
        totalPlayers,
        totalStadiums,
        totalSeats,
        totalParkingSlots,
        totalBookings,
      },
    });
  } catch (error) {
    console.error(
      "Admin dashboard error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to load admin dashboard.",
    });
  }
};

module.exports = {
  getDashboardStats,
};
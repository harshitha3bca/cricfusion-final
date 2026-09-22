import React, { useEffect, useState } from "react";
import "./AdminMatches.css";

const API_URL = "http://localhost:5000/api";

const emptyForm = {
  tournament: "",
  teamA: "",
  teamB: "",
  stadium: "",
  matchNumber: "",
  date: "",
  startTime: "",
  ticketPrice: "",
  status: "upcoming",
  parkingMode: "designated",
};

function AdminMatches() {
  const [matches, setMatches] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [stadiums, setStadiums] = useState([]);

  const [formData, setFormData] = useState(emptyForm);

  const [showForm, setShowForm] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // =====================================================
  // FETCH MATCHES
  // =====================================================

  const fetchMatches = async () => {
    try {
      const response = await fetch(`${API_URL}/matches`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to fetch matches"
        );
      }

      setMatches(data?.matches || []);
    } catch (err) {
      console.error("Fetch matches error:", err);
      setError(
        err?.message || "Unable to load matches."
      );
    }
  };

  // =====================================================
  // FETCH TOURNAMENTS
  // =====================================================

  const fetchTournaments = async () => {
    try {
      const response = await fetch(
        `${API_URL}/tournaments`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to fetch tournaments"
        );
      }

      setTournaments(data?.tournaments || []);
    } catch (err) {
      console.error(
        "Fetch tournaments error:",
        err
      );

      setError(
        err?.message ||
          "Unable to load tournaments."
      );
    }
  };

  // =====================================================
  // FETCH TEAMS
  // =====================================================

  const fetchTeams = async () => {
    try {
      const response = await fetch(
        `${API_URL}/teams`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to fetch teams"
        );
      }

      setTeams(data?.teams || []);
    } catch (err) {
      console.error("Fetch teams error:", err);

      setError(
        err?.message ||
          "Unable to load teams."
      );
    }
  };

  // =====================================================
  // FETCH STADIUMS
  // =====================================================

  const fetchStadiums = async () => {
    try {
      const response = await fetch(
        `${API_URL}/stadiums`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to fetch stadiums"
        );
      }

      setStadiums(data?.stadiums || []);
    } catch (err) {
      console.error(
        "Fetch stadiums error:",
        err
      );

      setError(
        err?.message ||
          "Unable to load stadiums."
      );
    }
  };

  // =====================================================
  // LOAD ALL DATA
  // =====================================================

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");

      await Promise.all([
        fetchMatches(),
        fetchTournaments(),
        fetchTeams(),
        fetchStadiums(),
      ]);

      setLoading(false);
    };

    loadData();
  }, []);

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // OPEN ADD FORM
  // =====================================================

  const handleAddMatch = () => {
    setEditingMatch(null);
    setFormData(emptyForm);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  // =====================================================
  // OPEN EDIT FORM
  // =====================================================

  const handleEditMatch = (match) => {
    setEditingMatch(match);

    setFormData({
      tournament:
        match?.tournament?._id ||
        match?.tournament ||
        "",

      teamA:
        match?.teamA?._id ||
        match?.teamA ||
        "",

      teamB:
        match?.teamB?._id ||
        match?.teamB ||
        "",

      stadium:
        match?.stadium?._id ||
        match?.stadium ||
        "",

      matchNumber:
        match?.matchNumber ?? "",

      date: match?.date
        ? new Date(match.date)
            .toISOString()
            .split("T")[0]
        : "",

      startTime:
        match?.startTime || "",

      ticketPrice:
        match?.ticketPrice ?? "",

      status:
        match?.status || "upcoming",

      parkingMode:
        match?.parkingMode || "designated",
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  };

  // =====================================================
  // CLOSE FORM
  // =====================================================

  const handleCancel = () => {
    setShowForm(false);
    setEditingMatch(null);
    setFormData(emptyForm);
    setError("");
  };

  // =====================================================
  // SUBMIT ADD / EDIT
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (formData.teamA === formData.teamB) {
      setError(
        "Team A and Team B cannot be the same."
      );
      return;
    }

    if (
      !formData.tournament ||
      !formData.teamA ||
      !formData.teamB ||
      !formData.stadium ||
      !formData.date ||
      !formData.startTime ||
      formData.ticketPrice === ""
    ) {
      setError(
        "Please fill in all required match details."
      );
      return;
    }

    try {
      setSaving(true);

      const token = getToken();

      if (!token) {
        throw new Error(
          "Admin authentication token is missing. Please login again."
        );
      }

      const payload = {
        tournament: formData.tournament,
        teamA: formData.teamA,
        teamB: formData.teamB,
        stadium: formData.stadium,
        matchNumber:
          formData.matchNumber === ""
            ? null
            : Number(formData.matchNumber),
        date: formData.date,
        startTime: formData.startTime,
        ticketPrice: Number(
          formData.ticketPrice
        ),
        status: formData.status,

        parkingMode:
          formData.parkingMode ||
          "designated",
      };

      const url = editingMatch
        ? `${API_URL}/matches/${editingMatch._id}`
        : `${API_URL}/matches`;

      const method = editingMatch
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            `Failed to ${
              editingMatch
                ? "update"
                : "create"
            } match`
        );
      }

      setSuccess(
        editingMatch
          ? "Match updated successfully."
          : "Match added successfully."
      );

      setShowForm(false);
      setEditingMatch(null);
      setFormData(emptyForm);

      await fetchMatches();
    } catch (err) {
      console.error(
        "Save match error:",
        err
      );

      setError(
        err?.message ||
          "Unable to save match."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE MATCH
  // =====================================================

  const handleDeleteMatch = async (match) => {
    const teamA =
      match?.teamA?.shortName ||
      match?.teamA?.name ||
      "Team A";

    const teamB =
      match?.teamB?.shortName ||
      match?.teamB?.name ||
      "Team B";

    const confirmed = window.confirm(
      `Are you sure you want to delete ${teamA} vs ${teamB}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      const token = getToken();

      if (!token) {
        throw new Error(
          "Admin authentication token is missing. Please login again."
        );
      }

      const response = await fetch(
        `${API_URL}/matches/${match._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to delete match"
        );
      }

      setSuccess(
        "Match deleted successfully."
      );

      await fetchMatches();
    } catch (err) {
      console.error(
        "Delete match error:",
        err
      );

      setError(
        err?.message ||
          "Unable to delete match."
      );
    }
  };

  // =====================================================
  // HELPERS
  // =====================================================

  const getTeamName = (team) => {
    if (!team) {
      return "Unknown Team";
    }

    return (
      team.shortName ||
      team.name ||
      "Unknown Team"
    );
  };

  const getStadiumName = (stadium) => {
    if (!stadium) {
      return "Unknown Stadium";
    }

    return (
      stadium.name ||
      "Unknown Stadium"
    );
  };

  const getTournamentName = (
    tournament
  ) => {
    if (!tournament) {
      return "Unknown Tournament";
    }

    return (
      tournament.name ||
      `${tournament.type || ""} ${
        tournament.season || ""
      }`.trim() ||
      "Unknown Tournament"
    );
  };

  const getParkingModeLabel = (
    parkingMode
  ) => {
    switch (parkingMode) {
      case "prebooking":
        return "Pre-Booking Available";

      case "designated":
        return "Designated Parking";

      case "firstCome":
        return "First-Come, First-Served";

      case "unavailable":
        return "Parking Unavailable";

      default:
        return "Designated Parking";
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="admin-matches-page">
      <div className="admin-matches-header">
        <div>
          <span className="admin-section-label">
            MATCH MANAGEMENT
          </span>

          <h1>Manage Matches</h1>

          <p>
            Create, update and manage IPL
            and WPL matches.
          </p>
        </div>

        {!showForm && (
          <button
            type="button"
            className="admin-add-match-btn"
            onClick={handleAddMatch}
          >
            <span>＋</span>
            Add Match
          </button>
        )}
      </div>

      {error && (
        <div className="admin-match-message error">
          <span>⚠</span>
          {error}
        </div>
      )}

      {success && (
        <div className="admin-match-message success">
          <span>✓</span>
          {success}
        </div>
      )}

      {showForm && (
        <div className="admin-match-form-card">
          <div className="admin-form-title">
            <div>
              <span className="admin-section-label">
                {editingMatch
                  ? "EDIT MATCH"
                  : "NEW MATCH"}
              </span>

              <h2>
                {editingMatch
                  ? "Edit Match Details"
                  : "Add New Match"}
              </h2>
            </div>

            <button
              type="button"
              className="admin-close-form-btn"
              onClick={handleCancel}
            >
              ×
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="admin-match-form"
          >
            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label htmlFor="tournament">
                  Tournament *
                </label>

                <select
                  id="tournament"
                  name="tournament"
                  value={formData.tournament}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select Tournament
                  </option>

                  {tournaments.map(
                    (tournament) => (
                      <option
                        key={tournament._id}
                        value={tournament._id}
                      >
                        {getTournamentName(
                          tournament
                        )}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="admin-form-group">
                <label htmlFor="matchNumber">
                  Match Number
                </label>

                <input
                  id="matchNumber"
                  name="matchNumber"
                  type="number"
                  min="1"
                  placeholder="e.g. 1"
                  value={formData.matchNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="teamA">
                  Team A *
                </label>

                <select
                  id="teamA"
                  name="teamA"
                  value={formData.teamA}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select Team A
                  </option>

                  {teams.map((team) => (
                    <option
                      key={team._id}
                      value={team._id}
                    >
                      {team.name}
                      {team.shortName
                        ? ` (${team.shortName})`
                        : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-form-group">
                <label htmlFor="teamB">
                  Team B *
                </label>

                <select
                  id="teamB"
                  name="teamB"
                  value={formData.teamB}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select Team B
                  </option>

                  {teams.map((team) => (
                    <option
                      key={team._id}
                      value={team._id}
                    >
                      {team.name}
                      {team.shortName
                        ? ` (${team.shortName})`
                        : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-form-group admin-form-full">
                <label htmlFor="stadium">
                  Stadium *
                </label>

                <select
                  id="stadium"
                  name="stadium"
                  value={formData.stadium}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select Stadium
                  </option>

                  {stadiums.map(
                    (stadium) => (
                      <option
                        key={stadium._id}
                        value={stadium._id}
                      >
                        {stadium.name}
                        {stadium.city
                          ? ` — ${stadium.city}`
                          : ""}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="admin-form-group">
                <label htmlFor="date">
                  Match Date *
                </label>

                <input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="startTime">
                  Start Time *
                </label>

                <input
                  id="startTime"
                  name="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="ticketPrice">
                  Ticket Price (₹) *
                </label>

                <input
                  id="ticketPrice"
                  name="ticketPrice"
                  type="number"
                  min="0"
                  placeholder="e.g. 750"
                  value={formData.ticketPrice}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="status">
                  Match Status
                </label>

                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="upcoming">
                    Upcoming
                  </option>

                  <option value="live">
                    Live
                  </option>

                  <option value="completed">
                    Completed
                  </option>

                  <option value="cancelled">
                    Cancelled
                  </option>
                </select>
              </div>

              {/* =================================================
                  PARKING ARRANGEMENT
              ================================================= */}

              <div className="admin-form-group admin-form-full">
                <label htmlFor="parkingMode">
                  Parking Arrangement
                </label>

                <select
                  id="parkingMode"
                  name="parkingMode"
                  value={
                    formData.parkingMode
                  }
                  onChange={handleChange}
                >
                  <option value="prebooking">
                    Pre-Booking Available
                  </option>

                  <option value="designated">
                    Designated Parking — No Online Booking
                  </option>

                  <option value="firstCome">
                    First-Come, First-Served
                  </option>

                  <option value="unavailable">
                    Parking Unavailable / Restricted
                  </option>
                </select>
              </div>
            </div>

            <div className="admin-form-actions">
              <button
                type="button"
                className="admin-cancel-btn"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="admin-save-match-btn"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingMatch
                  ? "Update Match"
                  : "Create Match"}
              </button>
            </div>
          </form>
        </div>
      )}

      {!showForm && (
        <div className="admin-match-list-card">
          <div className="admin-list-heading">
            <div>
              <h2>All Matches</h2>
              <p>
                {matches.length} match
                {matches.length !== 1
                  ? "es"
                  : ""}{" "}
                in the system
              </p>
            </div>
          </div>

          {loading ? (
            <div className="admin-match-loading">
              <div className="admin-loading-spinner"></div>
              <p>Loading matches...</p>
            </div>
          ) : matches.length === 0 ? (
            <div className="admin-empty-matches">
              <div className="admin-empty-icon">
                🏏
              </div>

              <h3>No Matches Found</h3>

              <p>
                Add your first IPL or WPL
                match to get started.
              </p>

              <button
                type="button"
                className="admin-add-match-btn"
                onClick={handleAddMatch}
              >
                ＋ Add Match
              </button>
            </div>
          ) : (
            <div className="admin-match-table-wrapper">
              <table className="admin-match-table">
                <thead>
                  <tr>
                    <th>Match</th>
                    <th>Tournament</th>
                    <th>Teams</th>
                    <th>Stadium</th>
                    <th>Date & Time</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Parking</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {matches.map((match) => (
                    <tr key={match._id}>
                      <td>
                        <div className="admin-match-number">
                          {match.matchNumber
                            ? `Match ${match.matchNumber}`
                            : "Match"}
                        </div>
                      </td>

                      <td>
                        <div className="admin-tournament-name">
                          {getTournamentName(
                            match.tournament
                          )}
                        </div>
                      </td>

                      <td>
                        <div className="admin-teams-cell">
                          <strong>
                            {getTeamName(
                              match.teamA
                            )}
                          </strong>

                          <span>vs</span>

                          <strong>
                            {getTeamName(
                              match.teamB
                            )}
                          </strong>
                        </div>
                      </td>

                      <td>
                        <div className="admin-stadium-cell">
                          <strong>
                            {getStadiumName(
                              match.stadium
                            )}
                          </strong>

                          {match.stadium?.city && (
                            <small>
                              {match.stadium.city}
                            </small>
                          )}
                        </div>
                      </td>

                      <td>
                        <div className="admin-date-cell">
                          <strong>
                            {formatDate(
                              match.date
                            )}
                          </strong>

                          <small>
                            {match.startTime ||
                              "—"}
                          </small>
                        </div>
                      </td>

                      <td>
                        <strong className="admin-price-cell">
                          ₹
                          {Number(
                            match.ticketPrice || 0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </strong>
                      </td>

                      <td>
                        <span
                          className={`admin-status-badge ${String(
                            match.status ||
                              "upcoming"
                          ).toLowerCase()}`}
                        >
                          {match.status ||
                            "upcoming"}
                        </span>
                      </td>

                      <td>
                        <div className="admin-stadium-cell">
                          <strong>
                            {getParkingModeLabel(
                              match.parkingMode
                            )}
                          </strong>
                        </div>
                      </td>

                      <td>
                        <div className="admin-action-buttons">
                          <button
                            type="button"
                            className="admin-edit-btn"
                            onClick={() =>
                              handleEditMatch(
                                match
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="admin-delete-btn"
                            onClick={() =>
                              handleDeleteMatch(
                                match
                              )
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminMatches;
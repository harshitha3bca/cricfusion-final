import React, {
  useEffect,
  useState,
} from "react";

import "./AdminTeams.css";

/* ========================================
   IPL TEAM LOGOS
======================================== */

import miLogo from "./assets/teams/mi.png";
import cskLogo from "./assets/teams/csk.png";
import rcbLogo from "./assets/teams/rcb.png";
import kkrLogo from "./assets/teams/kkr.png";
import rrLogo from "./assets/teams/rr.png";
import srhLogo from "./assets/teams/srh.png";
import dcLogo from "./assets/teams/dc.png";
import pbksLogo from "./assets/teams/pbks.png";
import gtLogo from "./assets/teams/gt.png";
import lsgLogo from "./assets/teams/lsg.png";

/* ========================================
   WPL TEAM LOGOS
======================================== */

import miWplLogo from "./assets/teams/mi-wpl.png";
import dcWplLogo from "./assets/teams/dc-wpl.png";
import rcbWplLogo from "./assets/teams/rcb-wpl.png";
import upwWplLogo from "./assets/teams/upw-wpl.png";
import ggWplLogo from "./assets/teams/gg-wpl.png";

const API_URL =
  "http://localhost:5000/api";

/* ========================================
   TEAM LOGO MAP
======================================== */

const TEAM_LOGOS = {
  RCB: rcbLogo,
  CSK: cskLogo,
  MI: miLogo,
  KKR: kkrLogo,
  RR: rrLogo,
  SRH: srhLogo,
  DC: dcLogo,
  PBKS: pbksLogo,
  GT: gtLogo,
  LSG: lsgLogo,

  /* WPL */
  MIW: miWplLogo,
  DCW: dcWplLogo,
  RCBW: rcbWplLogo,
  UPW: upwWplLogo,
  GG: ggWplLogo,
};

/* ========================================
   GET TEAM LOGO
======================================== */

const getTeamLogo = (team) => {
  const shortName =
    team?.shortName
      ?.trim()
      ?.toUpperCase();

  if (
    TEAM_LOGOS[shortName]
  ) {
    return TEAM_LOGOS[shortName];
  }

  /*
    WPL teams can sometimes use
    the same short name as IPL teams.
    Use tournament type + team name
    as an additional fallback.
  */

  const teamName =
    team?.name
      ?.trim()
      ?.toLowerCase();

  if (
    team?.tournamentType === "WPL"
  ) {
    if (
      teamName?.includes(
        "mumbai"
      )
    ) {
      return miWplLogo;
    }

    if (
      teamName?.includes(
        "delhi"
      )
    ) {
      return dcWplLogo;
    }

    if (
      teamName?.includes(
        "bengaluru"
      ) ||
      teamName?.includes(
        "bangalore"
      )
    ) {
      return rcbWplLogo;
    }

    if (
      teamName?.includes(
        "up warrior"
      )
    ) {
      return upwWplLogo;
    }

    if (
      teamName?.includes(
        "gujarat"
      )
    ) {
      return ggWplLogo;
    }
  }

  /*
    Final fallback:
    If MongoDB already contains a
    valid logo URL/path, use it.
  */

  return team?.logo || "";
};

function AdminTeams() {
  const [teams, setTeams] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [editingTeam, setEditingTeam] =
    useState(null);

  const [formData, setFormData] =
    useState({
      name: "",
      shortName: "",
      logo: "",
      tournamentType: "IPL",
    });

  // ========================================
  // FETCH TEAMS
  // ========================================

  const loadTeams = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/teams`
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to fetch teams."
        );
      }

      setTeams(
        Array.isArray(data?.teams)
          ? data.teams
          : []
      );
    } catch (err) {
      console.error(
        "Load teams error:",
        err
      );

      setError(
        err?.message ||
          "Unable to load teams."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeams();
  }, []);

  // ========================================
  // FORM CHANGE
  // ========================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };

  // ========================================
  // OPEN ADD FORM
  // ========================================

  const handleAddTeam = () => {
    setEditingTeam(null);

    setFormData({
      name: "",
      shortName: "",
      logo: "",
      tournamentType: "IPL",
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  };

  // ========================================
  // OPEN EDIT FORM
  // ========================================

  const handleEditTeam = (team) => {
    setEditingTeam(team);

    setFormData({
      name: team.name || "",
      shortName: team.shortName || "",
      logo: team.logo || "",
      tournamentType:
        team.tournamentType || "IPL",
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  };

  // ========================================
  // CANCEL FORM
  // ========================================

  const handleCancel = () => {
    setShowForm(false);
    setEditingTeam(null);

    setFormData({
      name: "",
      shortName: "",
      logo: "",
      tournamentType: "IPL",
    });

    setError("");
  };

  // ========================================
  // SAVE TEAM
  // ========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const token =
        localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Admin authentication is required."
        );
      }

      if (!formData.name.trim()) {
        throw new Error(
          "Team name is required."
        );
      }

      if (!formData.shortName.trim()) {
        throw new Error(
          "Short name is required."
        );
      }

      const payload = {
        name: formData.name.trim(),
        shortName:
          formData.shortName
            .trim()
            .toUpperCase(),
        logo: formData.logo.trim(),
        tournamentType:
          formData.tournamentType,
      };

      const url = editingTeam
        ? `${API_URL}/teams/${editingTeam._id}`
        : `${API_URL}/teams`;

      const method = editingTeam
        ? "PUT"
        : "POST";

      const response =
        await fetch(url, {
          method,
          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${token}`,
          },
          body: JSON.stringify(
            payload
          ),
        });

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to save team."
        );
      }

      setSuccess(
        editingTeam
          ? "Team updated successfully."
          : "Team created successfully."
      );

      setShowForm(false);
      setEditingTeam(null);

      setFormData({
        name: "",
        shortName: "",
        logo: "",
        tournamentType: "IPL",
      });

      await loadTeams();
    } catch (err) {
      console.error(
        "Save team error:",
        err
      );

      setError(
        err?.message ||
          "Unable to save team."
      );
    } finally {
      setSaving(false);
    }
  };

  // ========================================
  // DELETE TEAM
  // ========================================

  const handleDeleteTeam = async (team) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete ${team.name}?`
      );

    if (!confirmed) {
      return;
    }

    try {
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
          `${API_URL}/teams/${team._id}`,
          {
            method: "DELETE",
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
            "Unable to delete team."
        );
      }

      setSuccess(
        "Team deleted successfully."
      );

      await loadTeams();
    } catch (err) {
      console.error(
        "Delete team error:",
        err
      );

      setError(
        err?.message ||
          "Unable to delete team."
      );
    }
  };

  return (
    <section className="admin-teams-page">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="admin-teams-header">

        <div>
          <span className="admin-teams-label">
            TEAM MANAGEMENT
          </span>

          <h2>
            IPL & WPL Teams
          </h2>

          <p>
            Manage teams available on
            CricFusion.
          </p>
        </div>

        <button
          type="button"
          className="admin-teams-add-button"
          onClick={handleAddTeam}
        >
          + Add Team
        </button>

      </div>

      {/* ========================================
          MESSAGES
      ======================================== */}

      {error && (
        <div className="admin-teams-error">
          {error}
        </div>
      )}

      {success && (
        <div className="admin-teams-success">
          {success}
        </div>
      )}

      {/* ========================================
          FORM
      ======================================== */}

      {showForm && (
        <div className="admin-team-form-card">

          <div className="admin-team-form-heading">

            <div>
              <span>
                {editingTeam
                  ? "EDIT TEAM"
                  : "NEW TEAM"}
              </span>

              <h3>
                {editingTeam
                  ? "Update Team"
                  : "Add New Team"}
              </h3>
            </div>

            <button
              type="button"
              className="admin-team-close-button"
              onClick={handleCancel}
            >
              ×
            </button>

          </div>

          <form
            onSubmit={handleSubmit}
            className="admin-team-form"
          >

            <div className="admin-team-form-grid">

              <div className="admin-team-input-group">

                <label>
                  Team Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Royal Challengers Bengaluru"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="admin-team-input-group">

                <label>
                  Short Name
                </label>

                <input
                  type="text"
                  name="shortName"
                  placeholder="e.g. RCB"
                  value={formData.shortName}
                  onChange={handleChange}
                  maxLength={10}
                  required
                />

              </div>

              <div className="admin-team-input-group">

                <label>
                  Tournament
                </label>

                <select
                  name="tournamentType"
                  value={
                    formData.tournamentType
                  }
                  onChange={handleChange}
                >
                  <option value="IPL">
                    IPL
                  </option>

                  <option value="WPL">
                    WPL
                  </option>
                </select>

              </div>

              <div className="admin-team-input-group">

                <label>
                  Logo
                </label>

                <input
                  type="text"
                  name="logo"
                  placeholder="Logo path or URL"
                  value={formData.logo}
                  onChange={handleChange}
                />

              </div>

            </div>

            <div className="admin-team-form-actions">

              <button
                type="button"
                className="admin-team-cancel-button"
                onClick={handleCancel}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="admin-team-save-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingTeam
                  ? "Update Team"
                  : "Create Team"}
              </button>

            </div>

          </form>

        </div>
      )}

      {/* ========================================
          TEAMS TABLE
      ======================================== */}

      <div className="admin-teams-card">

        <div className="admin-teams-card-heading">

          <div>
            <span>
              REGISTERED TEAMS
            </span>

            <h3>
              All Teams
            </h3>
          </div>

          <div className="admin-team-count">
            {teams.length} Teams
          </div>

        </div>

        {loading ? (

          <div className="admin-teams-loading">
            Loading teams...
          </div>

        ) : teams.length === 0 ? (

          <div className="admin-teams-empty">
            <div>
              👥
            </div>

            <h3>
              No teams found
            </h3>

            <p>
              Add your first IPL or WPL
              team to get started.
            </p>
          </div>

        ) : (

          <div className="admin-teams-table-wrapper">

            <table className="admin-teams-table">

              <thead>
                <tr>
                  <th>
                    Team
                  </th>

                  <th>
                    Short Name
                  </th>

                  <th>
                    Tournament
                  </th>

                  <th>
                    Logo
                  </th>

                  <th>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>

                {teams.map(
                  (team) => {

                    const teamLogo =
                      getTeamLogo(team);

                    return (
                      <tr
                        key={team._id}
                      >

                        <td>

                          <div className="admin-team-name-cell">

                            <div className="admin-team-logo">

                              {teamLogo ? (
                                <img
                                  src={teamLogo}
                                  alt={team.name}
                                />
                              ) : (
                                <span>
                                  🏏
                                </span>
                              )}

                            </div>

                            <strong>
                              {team.name}
                            </strong>

                          </div>

                        </td>

                        <td>

                          <span className="admin-team-short-name">
                            {team.shortName}
                          </span>

                        </td>

                        <td>

                          <span
                            className={
                              team.tournamentType ===
                              "IPL"
                                ? "admin-team-league ipl"
                                : "admin-team-league wpl"
                            }
                          >
                            {team.tournamentType}
                          </span>

                        </td>

                        <td>

                          <span className="admin-team-logo-status">
                            {teamLogo
                              ? "Available"
                              : "Not Added"}
                          </span>

                        </td>

                        <td>

                          <div className="admin-team-actions">

                            <button
                              type="button"
                              className="admin-team-edit-button"
                              onClick={() =>
                                handleEditTeam(
                                  team
                                )
                              }
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="admin-team-delete-button"
                              onClick={() =>
                                handleDeleteTeam(
                                  team
                                )
                              }
                            >
                              Delete
                            </button>

                          </div>

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

    </section>
  );
}

export default AdminTeams;
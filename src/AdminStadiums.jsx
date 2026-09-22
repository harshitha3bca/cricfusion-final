
import React, {
  useEffect,
  useState,
} from "react";

import "./AdminStadiums.css";

/* ========================================
   STADIUM IMAGES
======================================== */

import arunJaitleyImage from "./ASSETS/stadiums/arun-jaitley.jpg";
import barsaparaImage from "./ASSETS/stadiums/barsapara.jpg";
import chidambaramImage from "./ASSETS/stadiums/chidambaram.jpg";
import chinnaswamyImage from "./ASSETS/stadiums/chinnaswamy.jpg";
import dharamshalaImage from "./ASSETS/stadiums/dharamshala.jpg";
import edenGardensImage from "./ASSETS/stadiums/eden-gardens.jpg";
import ekanaImage from "./ASSETS/stadiums/ekana.jpg";
import maharajaYadavindraSinghImage from "./ASSETS/stadiums/maharaja-yadavindra-singh.jpg";
import narendraModiImage from "./ASSETS/stadiums/narendra-modi.jpg";
import rajivGandhiImage from "./ASSETS/stadiums/rajiv-gandhi.jpg";
import sawaiMansinghImage from "./ASSETS/stadiums/sawai-mansingh.jpg";
import shaheedImage from "./ASSETS/stadiums/shaheed.jpg";
import wankhedeImage from "./ASSETS/stadiums/wankhede.jpg";

/* ========================================
   STADIUM IMAGE MAP
======================================== */

const stadiumImages = {
  "Arun Jaitley Stadium": arunJaitleyImage,
  "Arun Jaitley": arunJaitleyImage,

  "Barsapara Cricket Stadium": barsaparaImage,
  "Barsapara Stadium": barsaparaImage,
  "Barsapara": barsaparaImage,

  "M. A. Chidambaram Stadium": chidambaramImage,
  "MA Chidambaram Stadium": chidambaramImage,
  "M.A. Chidambaram Stadium": chidambaramImage,
  "M A Chidambaram Stadium": chidambaramImage,
  "Chidambaram Stadium": chidambaramImage,

  "M. Chinnaswamy Stadium": chinnaswamyImage,
  "M Chinnaswamy Stadium": chinnaswamyImage,
  "M.Chinnaswamy Stadium": chinnaswamyImage,
  "Chinnaswamy Stadium": chinnaswamyImage,

  "Himachal Pradesh Cricket Association Stadium":
    dharamshalaImage,
  "HPCA Stadium": dharamshalaImage,
  "Dharamshala": dharamshalaImage,

  "Eden Gardens": edenGardensImage,
  "Eden Gardens Stadium": edenGardensImage,

  "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium":
    ekanaImage,
  "Ekana Cricket Stadium": ekanaImage,
  "BRSABVE Cricket Stadium": ekanaImage,
  "Ekana": ekanaImage,

  "Maharaja Yadavindra Singh International Cricket Stadium":
    maharajaYadavindraSinghImage,
  "Maharaja Yadavindra Singh Stadium":
    maharajaYadavindraSinghImage,
  "Maharaja Yadavindra Singh":
    maharajaYadavindraSinghImage,

  "Narendra Modi Stadium": narendraModiImage,

  "Rajiv Gandhi International Cricket Stadium":
    rajivGandhiImage,
  "Rajiv Gandhi International Stadium":
    rajivGandhiImage,
  "Rajiv Gandhi Stadium":
    rajivGandhiImage,

  "Sawai Mansingh Stadium": sawaiMansinghImage,
  "Sawai Man Singh Stadium": sawaiMansinghImage,

  "Shaheed Veer Narayan Singh International Cricket Stadium":
    shaheedImage,
  "Shaheed Veer Narayan Singh Stadium":
    shaheedImage,
  "Shaheed Stadium": shaheedImage,

  "Wankhede Stadium": wankhedeImage,
};

const getStadiumImage = (stadium) => {
  if (!stadium?.name) {
    return stadium?.image || "";
  }

  const exactImage =
    stadiumImages[stadium.name.trim()];

  if (exactImage) {
    return exactImage;
  }

  const normalizedName =
    stadium.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");

  const matchedName =
    Object.keys(stadiumImages).find(
      (name) => {
        const normalizedMapName =
          name
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "");

        return (
          normalizedName.includes(
            normalizedMapName
          ) ||
          normalizedMapName.includes(
            normalizedName
          )
        );
      }
    );

  return matchedName
    ? stadiumImages[matchedName]
    : stadium.image || "";
};

const API_URL =
  "http://localhost:5000/api";

function AdminStadiums() {
  /* ========================================
     STADIUM STATES
  ======================================== */

  const [stadiums, setStadiums] =
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

  const [editingStadium, setEditingStadium] =
    useState(null);

  const [formData, setFormData] =
    useState({
      name: "",
      city: "",
      state: "",
      address: "",
      image: "",
      capacity: "",
      description: "",
    });

  /* ========================================
     SEAT STATES
  ======================================== */

  const [matches, setMatches] =
    useState([]);

  const [selectedSeatMatch, setSelectedSeatMatch] =
    useState("");

  const [seats, setSeats] =
    useState([]);

  const [seatLoading, setSeatLoading] =
    useState(false);

  const [seatSaving, setSeatSaving] =
    useState(false);

  const [seatError, setSeatError] =
    useState("");

  const [seatSuccess, setSeatSuccess] =
    useState("");

  const [seatForm, setSeatForm] =
    useState({
      stadium: "",
      match: "",
      section: "",
      row: "",
      startSeat: "",
      endSeat: "",
      price: "",
    });

  /* ========================================
     FETCH STADIUMS
  ======================================== */

  const loadStadiums = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/stadiums`
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to fetch stadiums."
        );
      }

      setStadiums(
        Array.isArray(data?.stadiums)
          ? data.stadiums
          : []
      );
    } catch (err) {
      console.error(
        "Load stadiums error:",
        err
      );

      setError(
        err?.message ||
          "Unable to load stadiums."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ========================================
     FETCH MATCHES
  ======================================== */

  const loadMatches = async () => {
    try {
      const response = await fetch(
        `${API_URL}/matches`
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to fetch matches."
        );
      }

      setMatches(
        Array.isArray(data?.matches)
          ? data.matches
          : []
      );
    } catch (err) {
      console.error(
        "Load matches error:",
        err
      );

      setSeatError(
        err?.message ||
          "Unable to load matches."
      );
    }
  };

  useEffect(() => {
    loadStadiums();
    loadMatches();
  }, []);

  /* ========================================
     STADIUM FORM CHANGE
  ======================================== */

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

  /* ========================================
     RESET STADIUM FORM
  ======================================== */

  const resetForm = () => {
    setFormData({
      name: "",
      city: "",
      state: "",
      address: "",
      image: "",
      capacity: "",
      description: "",
    });
  };

  /* ========================================
     ADD STADIUM
  ======================================== */

  const handleAddStadium = () => {
    setEditingStadium(null);

    resetForm();

    setError("");
    setSuccess("");
    setShowForm(true);
  };

  /* ========================================
     EDIT STADIUM
  ======================================== */

  const handleEditStadium = (stadium) => {
    setEditingStadium(stadium);

    setFormData({
      name: stadium.name || "",
      city: stadium.city || "",
      state: stadium.state || "",
      address: stadium.address || "",
      image: stadium.image || "",
      capacity:
        stadium.capacity || "",
      description:
        stadium.description || "",
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  };

  /* ========================================
     CANCEL
  ======================================== */

  const handleCancel = () => {
    setShowForm(false);
    setEditingStadium(null);

    resetForm();

    setError("");
  };

  /* ========================================
     SAVE STADIUM
  ======================================== */

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
          "Stadium name is required."
        );
      }

      if (!formData.city.trim()) {
        throw new Error(
          "City is required."
        );
      }

      if (!formData.capacity) {
        throw new Error(
          "Capacity is required."
        );
      }

      const payload = {
        name: formData.name.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        address:
          formData.address.trim(),
        image: formData.image.trim(),
        capacity: Number(
          formData.capacity
        ),
        description:
          formData.description.trim(),
      };

      const url = editingStadium
        ? `${API_URL}/stadiums/${editingStadium._id}`
        : `${API_URL}/stadiums`;

      const method = editingStadium
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
            "Unable to save stadium."
        );
      }

      setSuccess(
        editingStadium
          ? "Stadium updated successfully."
          : "Stadium created successfully."
      );

      setShowForm(false);
      setEditingStadium(null);

      resetForm();

      await loadStadiums();
    } catch (err) {
      console.error(
        "Save stadium error:",
        err
      );

      setError(
        err?.message ||
          "Unable to save stadium."
      );
    } finally {
      setSaving(false);
    }
  };

  /* ========================================
     DELETE STADIUM
  ======================================== */

  const handleDeleteStadium = async (
    stadium
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete ${stadium.name}?`
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
          `${API_URL}/stadiums/${stadium._id}`,
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
            "Unable to delete stadium."
        );
      }

      setSuccess(
        "Stadium deleted successfully."
      );

      await loadStadiums();
    } catch (err) {
      console.error(
        "Delete stadium error:",
        err
      );

      setError(
        err?.message ||
          "Unable to delete stadium."
      );
    }
  };

  /* ========================================
     SEAT FORM CHANGE
  ======================================== */

  const handleSeatChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setSeatForm(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };

  /* ========================================
     LOAD SEATS
  ======================================== */

  const loadSeats = async (matchId) => {
    if (!matchId) {
      setSeats([]);
      return;
    }

    try {
      setSeatLoading(true);
      setSeatError("");

      const response = await fetch(
        `${API_URL}/seats/match/${matchId}`
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to fetch seats."
        );
      }

      setSeats(
        Array.isArray(data?.seats)
          ? data.seats
          : []
      );
    } catch (err) {
      console.error(
        "Load seats error:",
        err
      );

      setSeatError(
        err?.message ||
          "Unable to load seats."
      );

      setSeats([]);
    } finally {
      setSeatLoading(false);
    }
  };

  /* ========================================
     MATCH CHANGE
  ======================================== */

  const handleSeatMatchChange = (
    event
  ) => {
    const matchId =
      event.target.value;

    setSelectedSeatMatch(matchId);

    setSeatForm(
      (previous) => ({
        ...previous,
        match: matchId,
      })
    );

    loadSeats(matchId);
  };

  /* ========================================
     CREATE MULTIPLE SEATS
  ======================================== */

  const handleCreateSeats = async (
    event
  ) => {
    event.preventDefault();

    setSeatError("");
    setSeatSuccess("");
    setSeatSaving(true);

    try {
      const token =
        localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Admin authentication is required."
        );
      }

      if (!seatForm.stadium) {
        throw new Error(
          "Please select a stadium."
        );
      }

      if (!seatForm.match) {
        throw new Error(
          "Please select a match."
        );
      }

      if (!seatForm.section.trim()) {
        throw new Error(
          "Section / stand is required."
        );
      }

      if (!seatForm.row.trim()) {
        throw new Error(
          "Row is required."
        );
      }

      if (
        seatForm.startSeat === "" ||
        seatForm.endSeat === ""
      ) {
        throw new Error(
          "Starting and ending seat numbers are required."
        );
      }

      const start =
        Number(
          seatForm.startSeat
        );

      const end =
        Number(
          seatForm.endSeat
        );

      if (
        Number.isNaN(start) ||
        Number.isNaN(end) ||
        start < 1 ||
        end < start
      ) {
        throw new Error(
          "Enter a valid seat range."
        );
      }

      if (
        end - start + 1 > 500
      ) {
        throw new Error(
          "You can create a maximum of 500 seats at once."
        );
      }

      if (
        seatForm.price === "" ||
        Number(seatForm.price) < 0
      ) {
        throw new Error(
          "Valid seat price is required."
        );
      }

      const seatsToCreate = [];

      for (
        let seatNumber = start;
        seatNumber <= end;
        seatNumber++
      ) {
        seatsToCreate.push({
          stadium:
            seatForm.stadium,

          match:
            seatForm.match,

          seatNumber:
            String(seatNumber),

          row:
            seatForm.row.trim(),

          section:
            seatForm.section.trim(),

          price:
            Number(
              seatForm.price
            ),
        });
      }

      const response =
        await fetch(
          `${API_URL}/seats/bulk`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              seats:
                seatsToCreate,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to create seats."
        );
      }

      setSeatSuccess(
        `${data?.count || seatsToCreate.length} seats created successfully.`
      );

      setSeatForm(
        (previous) => ({
          ...previous,

          section: "",

          row: "",

          startSeat: "",

          endSeat: "",

          price: "",
        })
      );

      await loadSeats(
        seatForm.match
      );
    } catch (err) {
      console.error(
        "Create seats error:",
        err
      );

      setSeatError(
        err?.message ||
          "Unable to create seats."
      );
    } finally {
      setSeatSaving(false);
    }
  };

  return (
    <section className="admin-stadiums-page">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="admin-stadiums-header">

        <div>
          <span className="admin-stadiums-label">
            STADIUM MANAGEMENT
          </span>

          <h2>
            IPL & WPL Stadiums
          </h2>

          <p>
            Manage stadiums available on
            CricFusion.
          </p>
        </div>

        <button
          type="button"
          className="admin-stadiums-add-button"
          onClick={handleAddStadium}
        >
          + Add Stadium
        </button>

      </div>

      {/* ========================================
          MESSAGES
      ======================================== */}

      {error && (
        <div className="admin-stadiums-error">
          {error}
        </div>
      )}

      {success && (
        <div className="admin-stadiums-success">
          {success}
        </div>
      )}

      {/* ========================================
          STADIUM FORM
      ======================================== */}

      {showForm && (
        <div className="admin-stadium-form-card">

          <div className="admin-stadium-form-heading">

            <div>
              <span>
                {editingStadium
                  ? "EDIT STADIUM"
                  : "NEW STADIUM"}
              </span>

              <h3>
                {editingStadium
                  ? "Update Stadium"
                  : "Add New Stadium"}
              </h3>
            </div>

            <button
              type="button"
              className="admin-stadium-close-button"
              onClick={handleCancel}
            >
              ×
            </button>

          </div>

          <form
            onSubmit={handleSubmit}
            className="admin-stadium-form"
          >

            <div className="admin-stadium-form-grid">

              <div className="admin-stadium-input-group">

                <label>
                  Stadium Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="e.g. M. Chinnaswamy Stadium"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="admin-stadium-input-group">

                <label>
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  placeholder="e.g. Bengaluru"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="admin-stadium-input-group">

                <label>
                  State
                </label>

                <input
                  type="text"
                  name="state"
                  placeholder="e.g. Karnataka"
                  value={formData.state}
                  onChange={handleChange}
                />

              </div>

              <div className="admin-stadium-input-group">

                <label>
                  Capacity
                </label>

                <input
                  type="number"
                  name="capacity"
                  placeholder="e.g. 40000"
                  min="1"
                  value={formData.capacity}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="admin-stadium-input-group admin-stadium-full-width">

                <label>
                  Address
                </label>

                <input
                  type="text"
                  name="address"
                  placeholder="Stadium address"
                  value={formData.address}
                  onChange={handleChange}
                />

              </div>

              <div className="admin-stadium-input-group admin-stadium-full-width">

                <label>
                  Image
                </label>

                <input
                  type="text"
                  name="image"
                  placeholder="Image path or URL"
                  value={formData.image}
                  onChange={handleChange}
                />

              </div>

              <div className="admin-stadium-input-group admin-stadium-full-width">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  placeholder="Enter stadium description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                />

              </div>

            </div>

            <div className="admin-stadium-form-actions">

              <button
                type="button"
                className="admin-stadium-cancel-button"
                onClick={handleCancel}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="admin-stadium-save-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingStadium
                  ? "Update Stadium"
                  : "Create Stadium"}
              </button>

            </div>

          </form>

        </div>
      )}

      {/* ========================================
          STADIUMS TABLE
      ======================================== */}

      <div className="admin-stadiums-card">

        <div className="admin-stadiums-card-heading">

          <div>
            <span>
              REGISTERED STADIUMS
            </span>

            <h3>
              All Stadiums
            </h3>
          </div>

          <div className="admin-stadium-count">
            {stadiums.length} Stadiums
          </div>

        </div>

        {loading ? (

          <div className="admin-stadiums-loading">
            Loading stadiums...
          </div>

        ) : stadiums.length === 0 ? (

          <div className="admin-stadiums-empty">

            <div>
              🏟️
            </div>

            <h3>
              No stadiums found
            </h3>

            <p>
              Add your first stadium to
              get started.
            </p>

          </div>

        ) : (

          <div className="admin-stadiums-table-wrapper">

            <table className="admin-stadiums-table">

              <thead>
                <tr>

                  <th>
                    Stadium
                  </th>

                  <th>
                    Location
                  </th>

                  <th>
                    Capacity
                  </th>

                  <th>
                    Image
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody>

                {stadiums.map(
                  (stadium) => {

                    const stadiumImage =
                      getStadiumImage(
                        stadium
                      );

                    return (
                      <tr
                        key={stadium._id}
                      >

                        <td>

                          <div className="admin-stadium-name-cell">

                            <div className="admin-stadium-image">

                              {stadiumImage ? (
                                <img
                                  src={
                                    stadiumImage
                                  }
                                  alt={
                                    stadium.name
                                  }
                                />
                              ) : (
                                <span>
                                  🏟️
                                </span>
                              )}

                            </div>

                            <div>

                              <strong>
                                {stadium.name}
                              </strong>

                              <small>
                                {stadium.state ||
                                  "India"}
                              </small>

                            </div>

                          </div>

                        </td>

                        <td>

                          <div className="admin-stadium-location">

                            <strong>
                              {stadium.city}
                            </strong>

                            <span>
                              {stadium.address ||
                                "Address not added"}
                            </span>

                          </div>

                        </td>

                        <td>

                          <span className="admin-stadium-capacity">

                            {Number(
                              stadium.capacity
                            ).toLocaleString(
                              "en-IN"
                            )}

                          </span>

                        </td>

                        <td>

                          <span className="admin-stadium-image-status">

                            {stadiumImage
                              ? "Available"
                              : "Not Added"}

                          </span>

                        </td>

                        <td>

                          <div className="admin-stadium-actions">

                            <button
                              type="button"
                              className="admin-stadium-edit-button"
                              onClick={() =>
                                handleEditStadium(
                                  stadium
                                )
                              }
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="admin-stadium-delete-button"
                              onClick={() =>
                                handleDeleteStadium(
                                  stadium
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

      {/* ========================================
          SEATS MANAGEMENT
      ======================================== */}

      <div
        className="admin-stadiums-card"
        style={{
          marginTop: "28px",
        }}
      >

        <div className="admin-stadiums-card-heading">

          <div>
            <span>
              SEAT MANAGEMENT
            </span>

            <h3>
              Stadium Seats
            </h3>
          </div>

          <div className="admin-stadium-count">
            {seats.length} Seats
          </div>

        </div>

        {/* ========================================
            SEAT MESSAGES
        ======================================== */}

        {seatError && (
          <div className="admin-stadiums-error">
            {seatError}
          </div>
        )}

        {seatSuccess && (
          <div className="admin-stadiums-success">
            {seatSuccess}
          </div>
        )}

        {/* ========================================
            CREATE SEATS - ONE FORM ONLY
        ======================================== */}

        <div
          className="admin-stadium-form-card"
          style={{
            marginBottom: "20px",
          }}
        >

          <div className="admin-stadium-form-heading">

            <div>
              <span>
                CREATE SEATS
              </span>

              <h3>
                Generate Stadium Seats
              </h3>
            </div>

          </div>

          <form
            onSubmit={handleCreateSeats}
            className="admin-stadium-form"
          >

            <div className="admin-stadium-form-grid">

              {/* STADIUM */}

              <div className="admin-stadium-input-group">

                <label>
                  Stadium
                </label>

                <select
                  name="stadium"
                  value={
                    seatForm.stadium
                  }
                  onChange={
                    handleSeatChange
                  }
                  required
                >

                  <option value="">
                    Select Stadium
                  </option>

                  {stadiums.map(
                    (stadium) => (
                      <option
                        key={
                          stadium._id
                        }
                        value={
                          stadium._id
                        }
                      >
                        {stadium.name}
                      </option>
                    )
                  )}

                </select>

              </div>

              {/* MATCH */}

              <div className="admin-stadium-input-group">

                <label>
                  Match
                </label>

                <select
                  name="match"
                  value={
                    seatForm.match
                  }
                  onChange={
                    handleSeatMatchChange
                  }
                  required
                >

                  <option value="">
                    Select Match
                  </option>

                  {matches.map(
                    (match) => {

                      const teamA =
                        match.teamA?.shortName ||
                        match.teamA?.name ||
                        "Team A";

                      const teamB =
                        match.teamB?.shortName ||
                        match.teamB?.name ||
                        "Team B";

                      return (
                        <option
                          key={
                            match._id
                          }
                          value={
                            match._id
                          }
                        >
                          {teamA} vs {teamB}
                        </option>
                      );
                    }
                  )}

                </select>

              </div>

              {/* SECTION */}

              <div className="admin-stadium-input-group">

                <label>
                  Stand / Section
                </label>

                <input
                  type="text"
                  name="section"
                  placeholder="e.g. North Stand"
                  value={
                    seatForm.section
                  }
                  onChange={
                    handleSeatChange
                  }
                  required
                />

              </div>

              {/* ROW */}

              <div className="admin-stadium-input-group">

                <label>
                  Row
                </label>

                <input
                  type="text"
                  name="row"
                  placeholder="e.g. A"
                  value={
                    seatForm.row
                  }
                  onChange={
                    handleSeatChange
                  }
                  required
                />

              </div>

              {/* STARTING SEAT */}

              <div className="admin-stadium-input-group">

                <label>
                  Starting Seat
                </label>

                <input
                  type="number"
                  name="startSeat"
                  placeholder="e.g. 1"
                  min="1"
                  value={
                    seatForm.startSeat
                  }
                  onChange={
                    handleSeatChange
                  }
                  required
                />

              </div>

              {/* ENDING SEAT */}

              <div className="admin-stadium-input-group">

                <label>
                  Ending Seat
                </label>

                <input
                  type="number"
                  name="endSeat"
                  placeholder="e.g. 20"
                  min="1"
                  value={
                    seatForm.endSeat
                  }
                  onChange={
                    handleSeatChange
                  }
                  required
                />

              </div>

              {/* PRICE */}

              <div className="admin-stadium-input-group">

                <label>
                  Price Per Seat
                </label>

                <input
                  type="number"
                  name="price"
                  placeholder="e.g. 1500"
                  min="0"
                  value={
                    seatForm.price
                  }
                  onChange={
                    handleSeatChange
                  }
                  required
                />

              </div>

            </div>

            <div className="admin-stadium-form-actions">

              <button
                type="submit"
                className="admin-stadium-save-button"
                disabled={seatSaving}
              >
                {seatSaving
                  ? "Creating Seats..."
                  : "Create Seats"}
              </button>

            </div>

          </form>

        </div>

        {/* ========================================
            EXISTING SEATS
        ======================================== */}

        <div className="admin-stadiums-card">

          <div className="admin-stadiums-card-heading">

            <div>
              <span>
                REGISTERED SEATS
              </span>

              <h3>
                Seats for Selected Match
              </h3>
            </div>

            <div className="admin-stadium-count">
              {seats.length} Seats
            </div>

          </div>

          {!selectedSeatMatch ? (

            <div className="admin-stadiums-empty">

              <div>
                💺
              </div>

              <h3>
                Select a Match
              </h3>

              <p>
                Select a match above to
                view its existing seats.
              </p>

            </div>

          ) : seatLoading ? (

            <div className="admin-stadiums-loading">
              Loading seats...
            </div>

          ) : seats.length === 0 ? (

            <div className="admin-stadiums-empty">

              <div>
                💺
              </div>

              <h3>
                No seats found
              </h3>

              <p>
                Use the Create Seats
                section above to generate
                seats for this match.
              </p>

            </div>

          ) : (

            <div className="admin-stadiums-table-wrapper">

              <table className="admin-stadiums-table">

                <thead>
                  <tr>

                    <th>
                      Seat
                    </th>

                    <th>
                      Stand / Section
                    </th>

                    <th>
                      Row
                    </th>

                    <th>
                      Stadium
                    </th>

                    <th>
                      Price
                    </th>

                    <th>
                      Status
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {seats.map(
                    (seat) => {

                      const status =
                        seat.status ||
                        "available";

                      const stadiumName =
                        stadiums.find(
                          (stadium) =>
                            String(
                              stadium._id
                            ) ===
                            String(
                              seat.stadium
                            )
                        )?.name ||
                        "—";

                      return (
                        <tr
                          key={
                            seat._id
                          }
                        >

                          <td>

                            <strong>
                              {
                                seat.seatNumber
                              }
                            </strong>

                          </td>

                          <td>
                            {
                              seat.section
                            }
                          </td>

                          <td>
                            {seat.row}
                          </td>

                          <td>
                            {
                              stadiumName
                            }
                          </td>

                          <td>

                            ₹
                            {Number(
                              seat.price
                            ).toLocaleString(
                              "en-IN"
                            )}

                          </td>

                          <td>

                            <span>
                              {status
                                .charAt(0)
                                .toUpperCase() +
                                status.slice(
                                  1
                                )}
                            </span>

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

      </div>

    </section>
  );
}

export default AdminStadiums;

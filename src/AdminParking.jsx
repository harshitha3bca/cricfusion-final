import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import "./AdminParking.css";

const API_URL =
  "http://localhost:5000/api";

function AdminParking() {
  const [matches, setMatches] =
    useState([]);

  const [stadiums, setStadiums] =
    useState([]);

  const [parkingSlots, setParkingSlots] =
    useState([]);

  const [selectedMatch, setSelectedMatch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [parkingLoading, setParkingLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [bulkSaving, setBulkSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [showBulkForm, setShowBulkForm] =
    useState(false);

  const [editingParking, setEditingParking] =
    useState(null);

  const [formData, setFormData] =
    useState({
      stadium: "",
      slotNumber: "",
      vehicleType: "car",
      price: "",
    });

  const [bulkFormData, setBulkFormData] =
    useState({
      stadium: "",
      startingSlot: "",
      numberOfSlots: "",
      vehicleType: "car",
      price: "",
    });

  // ========================================
  // LOAD MATCHES + STADIUMS
  // ========================================

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Admin authentication is required."
        );
      }

      const [
        matchesResponse,
        stadiumsResponse,
      ] = await Promise.all([
        fetch(`${API_URL}/matches`),
        fetch(`${API_URL}/stadiums`),
      ]);

      const matchesData =
        await matchesResponse.json();

      const stadiumsData =
        await stadiumsResponse.json();

      if (!matchesResponse.ok) {
        throw new Error(
          matchesData?.message ||
            "Unable to load matches."
        );
      }

      if (!stadiumsResponse.ok) {
        throw new Error(
          stadiumsData?.message ||
            "Unable to load stadiums."
        );
      }

      const loadedMatches =
        Array.isArray(matchesData)
          ? matchesData
          : matchesData?.matches || [];

      const loadedStadiums =
        Array.isArray(stadiumsData)
          ? stadiumsData
          : stadiumsData?.stadiums || [];

      setMatches(loadedMatches);
      setStadiums(loadedStadiums);

      if (loadedMatches.length > 0) {
        setSelectedMatch(
          loadedMatches[0]._id ||
            loadedMatches[0].id
        );
      }
    } catch (err) {
      console.error(
        "Admin parking initial data error:",
        err
      );

      setError(
        err?.message ||
          "Unable to load parking data."
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // LOAD PARKING FOR SELECTED MATCH
  // ========================================

  useEffect(() => {
    if (!selectedMatch) {
      setParkingSlots([]);
      return;
    }

    loadParking(selectedMatch);
  }, [selectedMatch]);

  const loadParking = async (
    matchId
  ) => {
    try {
      setParkingLoading(true);
      setError("");

      const response =
        await fetch(
          `${API_URL}/parking/match/${matchId}`
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to load parking slots."
        );
      }

      setParkingSlots(
        Array.isArray(data)
          ? data
          : data?.parkingSlots || []
      );
    } catch (err) {
      console.error(
        "Load parking error:",
        err
      );

      setError(
        err?.message ||
          "Unable to load parking slots."
      );

      setParkingSlots([]);
    } finally {
      setParkingLoading(false);
    }
  };

  // ========================================
  // SELECTED MATCH
  // ========================================

  const currentMatch = useMemo(() => {
    return matches.find(
      (match) =>
        (match._id || match.id) ===
        selectedMatch
    );
  }, [matches, selectedMatch]);

  // ========================================
  // STATISTICS
  // ========================================

  const totalSlots =
    parkingSlots.length;

  const availableSlots =
    parkingSlots.filter(
      (slot) =>
        slot.status === "available"
    ).length;

  const reservedSlots =
    parkingSlots.filter(
      (slot) =>
        slot.status === "reserved"
    ).length;

  const occupiedSlots =
    parkingSlots.filter(
      (slot) =>
        slot.status === "occupied"
    ).length;

  // ========================================
  // OPEN ADD FORM
  // ========================================

  const openAddForm = () => {
    setEditingParking(null);

    setFormData({
      stadium:
        currentMatch?.stadium?._id ||
        currentMatch?.stadium ||
        "",
      slotNumber: "",
      vehicleType: "car",
      price: "",
    });

    setError("");
    setSuccess("");
    setShowBulkForm(false);
    setShowForm(true);
  };

  // ========================================
  // OPEN BULK FORM
  // ========================================

  const openBulkForm = () => {
    setEditingParking(null);

    setBulkFormData({
      stadium:
        currentMatch?.stadium?._id ||
        currentMatch?.stadium ||
        "",
      startingSlot: "",
      numberOfSlots: "",
      vehicleType: "car",
      price: "",
    });

    setError("");
    setSuccess("");
    setShowForm(false);
    setShowBulkForm(true);
  };

  // ========================================
  // OPEN EDIT FORM
  // ========================================

  const openEditForm = (
    parking
  ) => {
    setEditingParking(parking);

    setFormData({
      stadium:
        parking.stadium?._id ||
        parking.stadium ||
        "",
      slotNumber:
        parking.slotNumber || "",
      vehicleType:
        parking.vehicleType || "car",
      price:
        parking.price ?? "",
    });

    setError("");
    setSuccess("");
    setShowBulkForm(false);
    setShowForm(true);
  };

  // ========================================
  // CLOSE FORM
  // ========================================

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingParking(null);

    setFormData({
      stadium: "",
      slotNumber: "",
      vehicleType: "car",
      price: "",
    });
  };

  // ========================================
  // CLOSE BULK FORM
  // ========================================

  const closeBulkForm = () => {
    if (bulkSaving) return;

    setShowBulkForm(false);

    setBulkFormData({
      stadium: "",
      startingSlot: "",
      numberOfSlots: "",
      vehicleType: "car",
      price: "",
    });
  };

  // ========================================
  // FORM CHANGE
  // ========================================

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ========================================
  // BULK FORM CHANGE
  // ========================================

  const handleBulkChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setBulkFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ========================================
  // CREATE SLOT NAME
  // ========================================

  const generateSlotNumber = (
    startingSlot,
    index
  ) => {
    const value =
      String(startingSlot || "").trim();

    /*
      Examples:

      C-01 -> C-01, C-02, C-03
      C01  -> C01, C02, C03
      A-1  -> A-1, A-2, A-3
      A1   -> A1, A2, A3
      01   -> 01, 02, 03
      1    -> 1, 2, 3
    */

    const match =
      value.match(
        /^(.*?)(\d+)$/
      );

    if (!match) {
      return `${value}-${index + 1}`;
    }

    const prefix =
      match[1];

    const numberPart =
      match[2];

    const startingNumber =
      Number(numberPart);

    const newNumber =
      startingNumber + index;

    const paddedNumber =
      String(newNumber).padStart(
        numberPart.length,
        "0"
      );

    return `${prefix}${paddedNumber}`;
  };

  // ========================================
  // SAVE SINGLE PARKING
  // ========================================

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (!formData.stadium) {
        throw new Error(
          "Please select a stadium."
        );
      }

      if (
        !formData.slotNumber.trim()
      ) {
        throw new Error(
          "Please enter a slot number."
        );
      }

      if (
        formData.price === "" ||
        Number(formData.price) < 0
      ) {
        throw new Error(
          "Please enter a valid parking price."
        );
      }

      const token =
        localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Admin authentication is required."
        );
      }

      const payload = {
        stadium: formData.stadium,
        slotNumber:
          formData.slotNumber.trim(),
        vehicleType:
          formData.vehicleType,
        price:
          Number(formData.price),
      };

      let response;

      if (editingParking) {
        response =
          await fetch(
            `${API_URL}/parking/${editingParking._id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type":
                  "application/json",
                Authorization:
                  `Bearer ${token}`,
              },
              body:
                JSON.stringify(
                  payload
                ),
            }
          );
      } else {
        response =
          await fetch(
            `${API_URL}/parking`,
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
                Authorization:
                  `Bearer ${token}`,
              },
              body:
                JSON.stringify(
                  payload
                ),
            }
          );
      }

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to save parking slot."
        );
      }

      setSuccess(
        editingParking
          ? "Parking slot updated successfully."
          : "Parking slot created successfully."
      );

      setShowForm(false);
      setEditingParking(null);

      setFormData({
        stadium: "",
        slotNumber: "",
        vehicleType: "car",
        price: "",
      });

      await loadParking(
        selectedMatch
      );
    } catch (err) {
      console.error(
        "Save parking error:",
        err
      );

      setError(
        err?.message ||
          "Unable to save parking slot."
      );
    } finally {
      setSaving(false);
    }
  };

  // ========================================
  // CREATE BULK PARKING SLOTS
  // ========================================

  const handleBulkSubmit = async (
    event
  ) => {
    event.preventDefault();

    try {
      setBulkSaving(true);
      setError("");
      setSuccess("");

      if (!bulkFormData.stadium) {
        throw new Error(
          "Please select a stadium."
        );
      }

      if (
        !bulkFormData.startingSlot.trim()
      ) {
        throw new Error(
          "Please enter a starting slot number."
        );
      }

      const numberOfSlots =
        Number(
          bulkFormData.numberOfSlots
        );

      if (
        !Number.isInteger(
          numberOfSlots
        ) ||
        numberOfSlots <= 0
      ) {
        throw new Error(
          "Please enter a valid number of parking slots."
        );
      }

      if (numberOfSlots > 500) {
        throw new Error(
          "You can create a maximum of 500 parking slots at once."
        );
      }

      if (
        bulkFormData.price === "" ||
        Number(bulkFormData.price) < 0
      ) {
        throw new Error(
          "Please enter a valid parking price."
        );
      }

      const token =
        localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Admin authentication is required."
        );
      }

      const existingSlotNumbers =
        new Set(
          parkingSlots.map(
            (slot) =>
              String(
                slot.slotNumber || ""
              )
                .trim()
                .toLowerCase()
          )
        );

      const slotsToCreate = [];

      const duplicateSlots = [];

      for (
        let index = 0;
        index < numberOfSlots;
        index++
      ) {
        const slotNumber =
          generateSlotNumber(
            bulkFormData.startingSlot,
            index
          );

        const normalizedSlot =
          slotNumber
            .trim()
            .toLowerCase();

        if (
          existingSlotNumbers.has(
            normalizedSlot
          )
        ) {
          duplicateSlots.push(
            slotNumber
          );
        } else {
          existingSlotNumbers.add(
            normalizedSlot
          );

          slotsToCreate.push({
            stadium:
              bulkFormData.stadium,
            slotNumber,
            vehicleType:
              bulkFormData.vehicleType,
            price:
              Number(
                bulkFormData.price
              ),
          });
        }
      }

      if (
        duplicateSlots.length > 0
      ) {
        throw new Error(
          `These parking slots already exist: ${duplicateSlots
            .slice(0, 10)
            .join(", ")}${
            duplicateSlots.length > 10
              ? "..."
              : ""
          }`
        );
      }

      if (
        slotsToCreate.length === 0
      ) {
        throw new Error(
          "No parking slots available to create."
        );
      }

      let createdCount = 0;

      /*
        Use the existing POST /parking
        endpoint so no backend route
        changes are required.
      */

      for (
        const slot of slotsToCreate
      ) {
        const response =
          await fetch(
            `${API_URL}/parking`,
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
                Authorization:
                  `Bearer ${token}`,
              },
              body:
                JSON.stringify(
                  slot
                ),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              `Unable to create parking slot ${slot.slotNumber}.`
          );
        }

        createdCount++;
      }

      setSuccess(
        `${createdCount} parking slots created successfully.`
      );

      setShowBulkForm(false);

      setBulkFormData({
        stadium: "",
        startingSlot: "",
        numberOfSlots: "",
        vehicleType: "car",
        price: "",
      });

      await loadParking(
        selectedMatch
      );
    } catch (err) {
      console.error(
        "Bulk parking error:",
        err
      );

      setError(
        err?.message ||
          "Unable to create bulk parking slots."
      );
    } finally {
      setBulkSaving(false);
    }
  };

  // ========================================
  // DELETE PARKING
  // ========================================

  const handleDelete = async (
    parking
  ) => {
    const confirmed =
      window.confirm(
        `Delete parking slot ${parking.slotNumber}?`
      );

    if (!confirmed) return;

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
          `${API_URL}/parking/${parking._id}`,
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
            "Unable to delete parking slot."
        );
      }

      setSuccess(
        "Parking slot deleted successfully."
      );

      await loadParking(
        selectedMatch
      );
    } catch (err) {
      console.error(
        "Delete parking error:",
        err
      );

      setError(
        err?.message ||
          "Unable to delete parking slot."
      );
    }
  };

  // ========================================
  // GET STADIUM NAME
  // ========================================

  const getStadiumName = (
    stadium
  ) => {
    if (
      stadium &&
      typeof stadium === "object"
    ) {
      return (
        stadium.name ||
        "Unknown Stadium"
      );
    }

    const found =
      stadiums.find(
        (item) =>
          (item._id || item.id) ===
          stadium
      );

    return (
      found?.name ||
      "Unknown Stadium"
    );
  };

  // ========================================
  // FORMAT MATCH
  // ========================================

  const getMatchName = (
    match
  ) => {
    if (!match) {
      return "Select a match";
    }

    const teamA =
      match.teamA?.name ||
      "Team A";

    const teamB =
      match.teamB?.name ||
      "Team B";

    return `${teamA} vs ${teamB}`;
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <div className="admin-parking-page">

      {/* ================= HEADER ================= */}

      <div className="admin-parking-header">

        <div>
          <span className="admin-parking-label">
            PARKING MANAGEMENT
          </span>

          <h2>
            Manage Parking Slots
          </h2>

          <p>
            Create, edit and manage
            parking inventory for
            IPL & WPL matches.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >

          <button
            type="button"
            className="admin-parking-add-button"
            onClick={openAddForm}
            disabled={!currentMatch}
          >
            <span>+</span>
            Add Parking Slot
          </button>

          <button
            type="button"
            className="admin-parking-add-button"
            onClick={openBulkForm}
            disabled={!currentMatch}
          >
            <span>+</span>
            Bulk Parking Slots
          </button>

        </div>

      </div>

      {/* ================= MESSAGES ================= */}

      {error && (
        <div className="admin-parking-error">
          {error}
        </div>
      )}

      {success && (
        <div className="admin-parking-success">
          {success}
        </div>
      )}

      {/* ================= MATCH SELECTOR ================= */}

      <section className="admin-parking-match-card">

        <div>
          <span className="admin-parking-section-label">
            MATCH
          </span>

          <h3>
            Parking Inventory
          </h3>
        </div>

        <div className="admin-parking-match-select-wrapper">

          <label>
            Select Match
          </label>

          <select
            value={selectedMatch}
            onChange={(event) =>
              setSelectedMatch(
                event.target.value
              )
            }
            disabled={loading}
          >
            {matches.length === 0 ? (
              <option value="">
                No matches available
              </option>
            ) : (
              matches.map(
                (match) => (
                  <option
                    key={
                      match._id ||
                      match.id
                    }
                    value={
                      match._id ||
                      match.id
                    }
                  >
                    {getMatchName(
                      match
                    )}
                  </option>
                )
              )
            )}
          </select>

        </div>

      </section>

      {/* ================= CURRENT MATCH ================= */}

      {currentMatch && (
        <section className="admin-parking-current-match">

          <div className="admin-parking-match-icon">
            🏏
          </div>

          <div>
            <span>
              CURRENT MATCH
            </span>

            <strong>
              {getMatchName(
                currentMatch
              )}
            </strong>

            <small>
              {getStadiumName(
                currentMatch.stadium
              )}
            </small>
          </div>

        </section>
      )}

      {/* ================= STAT CARDS ================= */}

      <section className="admin-parking-stats">

        <article className="admin-parking-stat-card">

          <div className="admin-parking-stat-icon">
            🚗
          </div>

          <div>
            <strong>
              {parkingLoading
                ? "—"
                : totalSlots}
            </strong>

            <span>
              Total Slots
            </span>
          </div>

        </article>

        <article className="admin-parking-stat-card">

          <div className="admin-parking-stat-icon">
            ✓
          </div>

          <div>
            <strong>
              {parkingLoading
                ? "—"
                : availableSlots}
            </strong>

            <span>
              Available
            </span>
          </div>

        </article>

        <article className="admin-parking-stat-card">

          <div className="admin-parking-stat-icon">
            ◷
          </div>

          <div>
            <strong>
              {parkingLoading
                ? "—"
                : reservedSlots}
            </strong>

            <span>
              Reserved
            </span>
          </div>

        </article>

        <article className="admin-parking-stat-card">

          <div className="admin-parking-stat-icon">
            ●
          </div>

          <div>
            <strong>
              {parkingLoading
                ? "—"
                : occupiedSlots}
            </strong>

            <span>
              Occupied
            </span>
          </div>

        </article>

      </section>

      {/* ================= SINGLE SLOT FORM ================= */}

      {showForm && (
        <section className="admin-parking-form-card">

          <div className="admin-parking-form-heading">

            <div>
              <span>
                {editingParking
                  ? "EDIT PARKING"
                  : "NEW PARKING"}
              </span>

              <h3>
                {editingParking
                  ? "Edit Parking Slot"
                  : "Add Parking Slot"}
              </h3>
            </div>

            <button
              type="button"
              className="admin-parking-close-button"
              onClick={closeForm}
            >
              ×
            </button>

          </div>

          <form
            onSubmit={handleSubmit}
          >

            <div className="admin-parking-form-grid">

              <div className="admin-parking-input-group">

                <label>
                  Stadium
                </label>

                <select
                  name="stadium"
                  value={
                    formData.stadium
                  }
                  onChange={
                    handleChange
                  }
                  disabled={
                    !!editingParking
                  }
                >
                  <option value="">
                    Select Stadium
                  </option>

                  {stadiums.map(
                    (stadium) => (
                      <option
                        key={
                          stadium._id ||
                          stadium.id
                        }
                        value={
                          stadium._id ||
                          stadium.id
                        }
                      >
                        {stadium.name}
                      </option>
                    )
                  )}
                </select>

              </div>

              <div className="admin-parking-input-group">

                <label>
                  Slot Number
                </label>

                <input
                  type="text"
                  name="slotNumber"
                  value={
                    formData.slotNumber
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Example: C-01"
                />

              </div>

              <div className="admin-parking-input-group">

                <label>
                  Vehicle Type
                </label>

                <select
                  name="vehicleType"
                  value={
                    formData.vehicleType
                  }
                  onChange={
                    handleChange
                  }
                >
                  <option value="car">
                    Car
                  </option>

                  <option value="bike">
                    Bike
                  </option>

                  <option value="other">
                    Other
                  </option>
                </select>

              </div>

              <div className="admin-parking-input-group">

                <label>
                  Price (₹)
                </label>

                <input
                  type="number"
                  name="price"
                  min="0"
                  value={
                    formData.price
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Example: 200"
                />

              </div>

            </div>

            <div className="admin-parking-form-actions">

              <button
                type="button"
                className="admin-parking-cancel-button"
                onClick={closeForm}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="admin-parking-save-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingParking
                  ? "Update Parking"
                  : "Create Parking"}
              </button>

            </div>

          </form>

        </section>
      )}

      {/* ================= BULK PARKING FORM ================= */}

      {showBulkForm && (
        <section className="admin-parking-form-card">

          <div className="admin-parking-form-heading">

            <div>
              <span>
                BULK PARKING
              </span>

              <h3>
                Create Multiple Parking Slots
              </h3>
            </div>

            <button
              type="button"
              className="admin-parking-close-button"
              onClick={closeBulkForm}
              disabled={bulkSaving}
            >
              ×
            </button>

          </div>

          <form
            onSubmit={
              handleBulkSubmit
            }
          >

            <div className="admin-parking-form-grid">

              {/* STADIUM */}

              <div className="admin-parking-input-group">

                <label>
                  Stadium
                </label>

                <select
                  name="stadium"
                  value={
                    bulkFormData.stadium
                  }
                  onChange={
                    handleBulkChange
                  }
                  disabled={bulkSaving}
                >
                  <option value="">
                    Select Stadium
                  </option>

                  {stadiums.map(
                    (stadium) => (
                      <option
                        key={
                          stadium._id ||
                          stadium.id
                        }
                        value={
                          stadium._id ||
                          stadium.id
                        }
                      >
                        {stadium.name}
                      </option>
                    )
                  )}

                </select>

              </div>

              {/* STARTING SLOT */}

              <div className="admin-parking-input-group">

                <label>
                  Starting Slot
                </label>

                <input
                  type="text"
                  name="startingSlot"
                  value={
                    bulkFormData.startingSlot
                  }
                  onChange={
                    handleBulkChange
                  }
                  placeholder="Example: C-01"
                  disabled={bulkSaving}
                />

                <small
                  style={{
                    marginTop: "6px",
                    display: "block",
                    opacity: 0.7,
                  }}
                >
                  Example: C-01 will create
                  C-01, C-02, C-03...
                </small>

              </div>

              {/* NUMBER OF SLOTS */}

              <div className="admin-parking-input-group">

                <label>
                  Number of Slots
                </label>

                <input
                  type="number"
                  name="numberOfSlots"
                  min="1"
                  max="500"
                  value={
                    bulkFormData.numberOfSlots
                  }
                  onChange={
                    handleBulkChange
                  }
                  placeholder="Example: 50"
                  disabled={bulkSaving}
                />

              </div>

              {/* VEHICLE TYPE */}

              <div className="admin-parking-input-group">

                <label>
                  Vehicle Type
                </label>

                <select
                  name="vehicleType"
                  value={
                    bulkFormData.vehicleType
                  }
                  onChange={
                    handleBulkChange
                  }
                  disabled={bulkSaving}
                >
                  <option value="car">
                    Car
                  </option>

                  <option value="bike">
                    Bike
                  </option>

                  <option value="other">
                    Other
                  </option>

                </select>

              </div>

              {/* PRICE */}

              <div className="admin-parking-input-group">

                <label>
                  Price (₹)
                </label>

                <input
                  type="number"
                  name="price"
                  min="0"
                  value={
                    bulkFormData.price
                  }
                  onChange={
                    handleBulkChange
                  }
                  placeholder="Example: 200"
                  disabled={bulkSaving}
                />

              </div>

            </div>

            {/* PREVIEW */}

            {bulkFormData.startingSlot &&
              Number(
                bulkFormData.numberOfSlots
              ) > 0 && (
                <div
                  style={{
                    marginTop: "20px",
                    padding: "16px",
                    borderRadius: "12px",
                    background:
                      "rgba(255,255,255,0.04)",
                    border:
                      "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <strong>
                    Parking Slot Preview
                  </strong>

                  <p
                    style={{
                      margin:
                        "8px 0 0",
                      opacity: 0.75,
                    }}
                  >
                    {generateSlotNumber(
                      bulkFormData.startingSlot,
                      0
                    )}{" "}
                    →{" "}
                    {generateSlotNumber(
                      bulkFormData.startingSlot,
                      Number(
                        bulkFormData.numberOfSlots
                      ) - 1
                    )}
                  </p>

                  <p
                    style={{
                      margin:
                        "6px 0 0",
                      opacity: 0.75,
                    }}
                  >
                    {
                      Number(
                        bulkFormData.numberOfSlots
                      )
                    }{" "}
                    slots will be created at ₹
                    {Number(
                      bulkFormData.price || 0
                    )} each.
                  </p>
                </div>
              )}

            <div className="admin-parking-form-actions">

              <button
                type="button"
                className="admin-parking-cancel-button"
                onClick={
                  closeBulkForm
                }
                disabled={bulkSaving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="admin-parking-save-button"
                disabled={bulkSaving}
              >
                {bulkSaving
                  ? "Creating Slots..."
                  : "Create Bulk Slots"}
              </button>

            </div>

          </form>

        </section>
      )}

      {/* ================= PARKING TABLE ================= */}

      <section className="admin-parking-table-card">

        <div className="admin-parking-table-heading">

          <div>
            <span>
              PARKING INVENTORY
            </span>

            <h3>
              Parking Slots
            </h3>
          </div>

          <div className="admin-parking-count">
            {totalSlots} Slots
          </div>

        </div>

        {parkingLoading ? (

          <div className="admin-parking-loading">
            Loading parking slots...
          </div>

        ) : parkingSlots.length === 0 ? (

          <div className="admin-parking-empty">

            <div>
              🚗
            </div>

            <h3>
              No Parking Slots
            </h3>

            <p>
              No parking slots have
              been created for this
              match yet.
            </p>

            <button
              type="button"
              onClick={
                openAddForm
              }
              disabled={!currentMatch}
            >
              + Add Parking Slot
            </button>

          </div>

        ) : (

          <div className="admin-parking-table-wrapper">

            <table className="admin-parking-table">

              <thead>
                <tr>
                  <th>
                    SLOT
                  </th>

                  <th>
                    STADIUM
                  </th>

                  <th>
                    VEHICLE
                  </th>

                  <th>
                    PRICE
                  </th>

                  <th>
                    STATUS
                  </th>

                  <th>
                    ACTIONS
                  </th>
                </tr>
              </thead>

              <tbody>

                {parkingSlots.map(
                  (parking) => (
                    <tr
                      key={
                        parking._id
                      }
                    >

                      <td>
                        <div className="admin-parking-slot-cell">

                          <span className="admin-parking-slot-icon">
                            🚗
                          </span>

                          <strong>
                            {
                              parking.slotNumber
                            }
                          </strong>

                        </div>
                      </td>

                      <td>
                        <div className="admin-parking-stadium-cell">
                          {
                            getStadiumName(
                              parking.stadium
                            )
                          }
                        </div>
                      </td>

                      <td>
                        <span className="admin-parking-vehicle">
                          {parking.vehicleType ===
                          "car"
                            ? "🚙 Car"
                            : parking.vehicleType ===
                              "bike"
                            ? "🏍️ Bike"
                            : "🚘 Other"}
                        </span>
                      </td>

                      <td>
                        <strong className="admin-parking-price">
                          ₹
                          {
                            parking.price
                          }
                        </strong>
                      </td>

                      <td>

                        <span
                          className={`admin-parking-status ${parking.status}`}
                        >
                          <span></span>

                          {parking.status}
                        </span>

                      </td>

                      <td>

                        <div className="admin-parking-actions">

                          <button
                            type="button"
                            className="admin-parking-edit-button"
                            onClick={() =>
                              openEditForm(
                                parking
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="admin-parking-delete-button"
                            onClick={() =>
                              handleDelete(
                                parking
                              )
                            }
                            disabled={
                              parking.status !==
                              "available"
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </div>
  );
}

export default AdminParking;
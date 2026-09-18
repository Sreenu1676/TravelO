import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDate } from "../../context";
import "./SearchModal.css";

export const SearchModal = () => {
  const {
    destination,
    guests,
    checkInDate,
    checkOutDate,
    isSearchModalOpen,
    dateDispatch,
  } = useDate();

  const navigate = useNavigate();

  /* =========================================
     SEARCH VALUES
  ========================================= */

  const [place, setPlace] = useState(
    destination || ""
  );

  const [checkIn, setCheckIn] = useState(
    checkInDate
      ? checkInDate.toISOString().split("T")[0]
      : ""
  );

  const [checkOut, setCheckOut] = useState(
    checkOutDate
      ? checkOutDate.toISOString().split("T")[0]
      : ""
  );

  const [guestCount, setGuestCount] = useState(
    guests || 0
  );

  /* =========================================
     HOTEL DATA
  ========================================= */

  const [hotels, setHotels] = useState([]);

  const [showPlaces, setShowPlaces] =
    useState(false);

  /* =========================================
     LOAD HOTELS
  ========================================= */

  useEffect(() => {
    if (!isSearchModalOpen) {
      return;
    }

    const getHotels = async () => {
      try {
        const response = await axios.get(
          "/api/hotels"
        );

        const data = response.data;

        console.log(
          "Hotels loaded:",
          data
        );

        setHotels(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (error) {
        console.error(
          "Failed to load hotels:",
          error
        );

        setHotels([]);
      }
    };

    getHotels();
  }, [isSearchModalOpen]);

  /* =========================================
     CREATE PLACE LIST
     
     IMPORTANT:
     
     We use ONLY hotel.address.

     This prevents:
     
     Jibhi, Jibhi
     Kasol, Kasol
     Manali, Manali

     and gives:
     
     Jibhi
     Kasol
     Manali
     etc.
  ========================================= */

  const places = [
    ...new Set(
      hotels
        .map((hotel) =>
          String(
            hotel?.address || ""
          ).trim()
        )
        .filter(Boolean)
    ),
  ];

  /* =========================================
     FILTER PLACES
     
     IMPORTANT:
     
     There is NO .slice(0, 15)
     
     Therefore ALL places are available.
  ========================================= */

  const filteredPlaces = places.filter(
    (destinationName) => {
      const searchText =
        place.trim().toLowerCase();

      if (!searchText) {
        return true;
      }

      return destinationName
        .toLowerCase()
        .includes(searchText);
    }
  );

  /* =========================================
     SELECT PLACE
  ========================================= */

  const selectPlace = (
    destinationName
  ) => {
    setPlace(destinationName);

    setShowPlaces(false);
  };

  /* =========================================
     SEARCH
  ========================================= */

  const handleSearch = () => {
    const selectedDestination =
      place.trim();

    /* DESTINATION */

    dateDispatch({
      type: "DESTINATION",
      payload: selectedDestination,
    });

    /* GUESTS */

    dateDispatch({
      type: "GUESTS",
      payload:
        Number(guestCount) || 0,
    });

    /* CHECK IN */

    dateDispatch({
      type: "CHECK_IN",
      payload: checkIn
        ? new Date(checkIn)
        : null,
    });

    /* CHECK OUT */

    dateDispatch({
      type: "CHECK_OUT",
      payload: checkOut
        ? new Date(checkOut)
        : null,
    });

    /* CLOSE MODAL */

    dateDispatch({
      type: "CLOSE_SEARCH_MODAL",
    });

    setShowPlaces(false);

    /* GO TO SEARCH PAGE */

    navigate("/search");
  };

  /* =========================================
     CLOSE
  ========================================= */

  const handleClose = () => {
    setShowPlaces(false);

    dateDispatch({
      type: "CLOSE_SEARCH_MODAL",
    });
  };

  /* =========================================
     DON'T RENDER WHEN CLOSED
  ========================================= */

  if (!isSearchModalOpen) {
    return null;
  }

  /* =========================================
     UI
  ========================================= */

  return (
    <>
      {/* =====================================
          BACKDROP
      ===================================== */}

      <div
        className="search-modal-backdrop"
        onClick={handleClose}
      />

      {/* =====================================
          SEARCH PANEL
      ===================================== */}

      <div className="search-panel">

        {/* ===================================
            WHERE
        =================================== */}

        <div className="search-panel-field where-field">

          <label>
            Where
          </label>

          <input
            type="text"
            value={place}
            placeholder="Search destination"
            autoComplete="off"
            onFocus={() => {
              setShowPlaces(true);
            }}
            onChange={(event) => {
              setPlace(
                event.target.value
              );

              setShowPlaces(true);
            }}
          />

          {/* =================================
              PLACE DROPDOWN
          ================================= */}

          {showPlaces &&
            filteredPlaces.length > 0 && (
              <div className="place-suggestions">

                {filteredPlaces.map(
                  (
                    destinationName,
                    index
                  ) => (
                    <div
                      key={`${destinationName}-${index}`}
                      className="place-option"
                      onMouseDown={(
                        event
                      ) => {
                        event.preventDefault();

                        selectPlace(
                          destinationName
                        );
                      }}
                    >
                      {destinationName}
                    </div>
                  )
                )}

              </div>
            )}

        </div>

        {/* ===================================
            CHECK IN
        =================================== */}

        <div className="search-panel-field">

          <label>
            Check in
          </label>

          <input
            type="date"
            value={checkIn}
            onChange={(event) => {
              setCheckIn(
                event.target.value
              );
            }}
          />

          {!checkIn && (
            <span className="date-placeholder">
              Add dates
            </span>
          )}

        </div>

        {/* ===================================
            CHECK OUT
        =================================== */}

        <div className="search-panel-field">

          <label>
            Check out
          </label>

          <input
            type="date"
            value={checkOut}
            min={
              checkIn || undefined
            }
            onChange={(event) => {
              setCheckOut(
                event.target.value
              );
            }}
          />

          {!checkOut && (
            <span className="date-placeholder">
              Add dates
            </span>
          )}

        </div>

        {/* ===================================
            GUESTS
        =================================== */}

        <div className="search-panel-field">

          <label>
            No. of Guests
          </label>

          <input
            type="number"
            min="0"
            value={guestCount}
            onChange={(event) => {
              setGuestCount(
                event.target.value
              );
            }}
          />

        </div>

        {/* ===================================
            SEARCH BUTTON
        =================================== */}

        <button
          type="button"
          className="search-panel-button"
          onClick={handleSearch}
        >
          <span className="material-icons-outlined">
            search
          </span>

          Search
        </button>

      </div>
    </>
  );
};
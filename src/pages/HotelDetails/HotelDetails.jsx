import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context";
import "./HotelDetails.css";

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accessToken } = useAuth();


  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(0);

  const [selectedImage, setSelectedImage] = useState("");

  /* =========================================
     LOAD SINGLE HOTEL
  ========================================= */

  useEffect(() => {
    const loadHotel = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/hotels/${id}`);

        if (!response.ok) {
          throw new Error("Unable to load hotel");
        }

        const data = await response.json();

        setHotel(data);

        if (data?.image) {
          setSelectedImage(data.image);
        }
      } catch (err) {
        console.error("Hotel details error:", err);
        setError("Unable to load hotel details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadHotel();
    }
  }, [id]);

  /* =========================================
     IMAGES
  ========================================= */

  const images = useMemo(() => {
    if (!hotel) return [];

    const allImages = [];

    if (hotel.image) {
      allImages.push(hotel.image);
    }

    if (Array.isArray(hotel.imageArr)) {
      allImages.push(...hotel.imageArr);
    }

    return [...new Set(allImages.filter(Boolean))];
  }, [hotel]);

  /* =========================================
     PRICE
  ========================================= */

  const price = Number(hotel?.price || 0);

  /* =========================================
     NIGHTS
  ========================================= */

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) {
      return 0;
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const difference = end.getTime() - start.getTime();

    if (difference <= 0) {
      return 0;
    }

    return Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );
  }, [checkIn, checkOut]);

  const roomTotal = price * nights;

  const serviceFee = nights > 0 ? 150 : 0;

  const total = roomTotal + serviceFee;


const handleReserve = () => {
  if (!accessToken) {
    alert("Please login before making a reservation.");
    return;
  }

  navigate("/order-summary", {
    state: {
      hotel,
      checkIn,
      checkOut,
      guests,
      nights,
      roomTotal,
      serviceFee,
      total,
    },
  });
};
  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <div className="hotel-details-loading">
        Loading hotel details...
      </div>
    );
  }

  /* =========================================
     ERROR
  ========================================= */

  if (error || !hotel) {
    return (
      <div className="hotel-details-error">
        {error || "Hotel not found."}
      </div>
    );
  }

  /* =========================================
     CHECK-IN / CHECK-OUT RULES
  ========================================= */

  const houseRules = Array.isArray(hotel.houseRules)
    ? hotel.houseRules
    : [];

  const amenities = Array.isArray(hotel.ameneties)
    ? hotel.ameneties
    : [];

  const healthAndSafety = Array.isArray(
    hotel.healthAndSafety
  )
    ? hotel.healthAndSafety
    : [];

  /* =========================================
     MAIN UI
  ========================================= */

  return (
    <div className="hotel-details-page">

      {/* =====================================
          HOTEL NAME
      ===================================== */}

      <div className="hotel-page-title">

        <div className="hotel-name-title">
          {hotel.name || "Hotel"}
          {hotel.country
            ? `, ${hotel.country}`
            : ""}
        </div>

        <div className="hotel-location-rating">

          <span>
            {hotel.address}

            {hotel.state
              ? `, ${hotel.state}`
              : ""}
          </span>

          <span className="hotel-rating">
            ★ {hotel.rating}
          </span>

        </div>

      </div>


      {/* =====================================
          IMAGE GALLERY
      ===================================== */}

      <div className="hotel-gallery">

        <div className="gallery-main">

          <img
            src={
              selectedImage ||
              hotel.image
            }
            alt={hotel.name || "Hotel"}
          />

        </div>


        <div className="gallery-side">

          {images.slice(1, 5).map(
            (image, index) => (

              <button
                type="button"
                className="gallery-small"
                key={`${image}-${index}`}
                onClick={() =>
                  setSelectedImage(image)
                }
              >

                <img
                  src={image}
                  alt={`${hotel.name || "Hotel"} ${
                    index + 2
                  }`}
                />

              </button>

            )
          )}

        </div>

      </div>


      {/* =====================================
          MAIN CONTENT
      ===================================== */}

      <div className="hotel-content">

        {/* =================================
            LEFT SIDE
        ================================= */}

        <main className="hotel-left">

          {/* HOST */}

          <section className="host-section">

            <h2>
              Hosted by{" "}
              {hotel.hostName || "Host"}
            </h2>

            <p className="property-summary">

              {hotel.numberOfguest || 0} guests
              {" · "}
              {hotel.numberOfBedrooms || 0} bedrooms
              {" · "}
              {hotel.numberOfBeds || 0} beds
              {" · "}
              {hotel.numberOfBathrooms || 0} bathrooms

            </p>

          </section>


          {/* =================================
              PROPERTY TYPE
          ================================= */}

          <section className="details-section">

            <h2>
              About this place
            </h2>

            <div className="details-row">

              <span className="details-icon">
                ▦
              </span>

              <div>

                <strong>
                  {hotel.propertyType ||
                    "Property"}
                </strong>

                <p>
                  A comfortable place to stay
                  during your trip.
                </p>

              </div>

            </div>

          </section>


          {/* =================================
              HOUSE RULES
          ================================= */}

          {houseRules.length > 0 && (

            <section className="details-section">

              <h2>
                House rules
              </h2>

              <div className="details-list">

                {houseRules.map(
                  (rule, index) => (

                    <div
                      className="details-row"
                      key={`rule-${index}`}
                    >

                      <span className="details-icon">
                        ▦
                      </span>

                      <span>
                        {rule}
                      </span>

                    </div>

                  )
                )}

              </div>

            </section>

          )}


          {/* =================================
              HEALTH AND SAFETY
          ================================= */}

          {healthAndSafety.length > 0 && (

            <section className="details-section">

              <h2>
                Health and safety
              </h2>

              <div className="details-list">

                {healthAndSafety.map(
                  (item, index) => (

                    <div
                      className="details-row"
                      key={`safety-${index}`}
                    >

                      <span className="details-icon">
                        ▦
                      </span>

                      <span>
                        {item}
                      </span>

                    </div>

                  )
                )}

              </div>

            </section>

          )}


          {/* =================================
              AMENITIES
          ================================= */}

          <section className="details-section">

            <h2>
              What this place offers
            </h2>

            {amenities.length > 0 ? (

              <div className="amenities-grid">

                {amenities.map(
                  (amenity, index) => (

                    <div
                      className="amenity-item"
                      key={`amenity-${index}`}
                    >

                      <span className="amenity-icon">
                        ▦
                      </span>

                      <span>
                        {amenity}
                      </span>

                    </div>

                  )
                )}

              </div>

            ) : (

              <p className="empty-text">
                No amenities listed.
              </p>

            )}

          </section>


          {/* =================================
              CANCELLATION
          ================================= */}

          <section className="details-section">

            <div className="details-row">

              <span className="details-icon">
                ▦
              </span>

              <div>

                <strong>
                  Free cancellation
                </strong>

                <p>
                  {hotel.isCancelable
                    ? "This property offers free cancellation."
                    : "Cancellation policy may apply."}
                </p>

              </div>

            </div>

          </section>

        </main>


        {/* ===================================
            RIGHT BOOKING CARD
        =================================== */}

        <aside className="booking-card">

          <div className="booking-top">

            <div>

              <span className="booking-price">
                ₹
                {price.toLocaleString(
                  "en-IN"
                )}
              </span>

              <span className="booking-night">
                {" "}night
              </span>

            </div>

            <div className="booking-rating">
              ★ {hotel.rating}
            </div>

          </div>


          {/* DATES */}

          <div className="date-box">

            <div className="date-field">

              <label>
                CHECK IN
              </label>

              <input
                type="date"
                value={checkIn}
                min={
                  new Date()
                    .toISOString()
                    .split("T")[0]
                }
                onChange={(e) =>
                  setCheckIn(
                    e.target.value
                  )
                }
              />

            </div>


            <div className="date-field">

              <label>
                CHECK OUT
              </label>

              <input
                type="date"
                value={checkOut}
                min={
                  checkIn ||
                  new Date()
                    .toISOString()
                    .split("T")[0]
                }
                onChange={(e) =>
                  setCheckOut(
                    e.target.value
                  )
                }
              />

            </div>

          </div>


          {/* GUESTS */}

          <div className="guests-field">

            <label>
              GUESTS
            </label>

            <input
              type="number"
              min="0"
              max={
                hotel.numberOfguest ||
                20
              }
              value={guests}
              onChange={(e) =>
                setGuests(
                  Number(e.target.value)
                )
              }
            />

          </div>


          {/* RESERVE */}

          <button
            type="button"
            className="reserve-button"
            disabled={
              !checkIn ||
              !checkOut ||
              guests <= 0 ||
              nights <= 0
            }
            onClick={handleReserve}
          >
            Reserve
          </button>


          {/* PRICE BREAKDOWN */}

          <div className="price-breakdown">

            <div className="price-line">

              <span>
                ₹
                {price.toLocaleString(
                  "en-IN"
                )} × {nights} nights
              </span>

              <span>
                ₹
                {roomTotal.toLocaleString(
                  "en-IN"
                )}
              </span>

            </div>


            <div className="price-line">

              <span>
                Service fee
              </span>

              <span>
                ₹
                {serviceFee.toLocaleString(
                  "en-IN"
                )}
              </span>

            </div>


            <div className="price-total">

              <strong>
                Total
              </strong>

              <strong>
                ₹
                {total.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

          </div>

        </aside>

      </div>

    </div>
  );
};

export default HotelDetails;
import { useLocation, useNavigate } from "react-router-dom";
import "./OrderSummary.css";

const OrderSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    hotel,
    checkIn,
    checkOut,
    guests,
    nights,
    roomTotal,
    serviceFee,
    total,
  } = location.state || {};

  const formatDate = (date) => {
    if (!date) return "";

    const formatted = new Date(`${date}T00:00:00`);

    return formatted.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const handleConfirmBooking = () => {
    // Payment page will be connected here next.
    navigate("/payment", {
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

  if (!hotel) {
    return (
      <main className="order-summary-page">
        <div className="order-summary-empty">
          <h2>Reservation details not found</h2>
          <button
            type="button"
            onClick={() => navigate("/")}
          >
            Continue Booking
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="order-summary-page">
      <div className="order-summary-wrapper">

        {/* LEFT SIDE */}
        <section className="trip-details">

          <h1>Trip Details</h1>

          <h2>Your Trip</h2>

          <div className="trip-info">
            <span className="trip-label">Dates</span>

            <span className="trip-value">
              {formatDate(checkIn)} - {formatDate(checkOut)}
            </span>
          </div>

          <div className="trip-info">
            <span className="trip-label">Guests</span>

            <span className="trip-value">
              {guests} {guests === 1 ? "guest" : "guests"}
            </span>
          </div>

          <div className="trip-divider"></div>

          <h2>Pay with</h2>

          <div className="payment-method">
            <span>Razorpay</span>
          </div>

          <button
            type="button"
            className="confirm-booking-button"
            onClick={handleConfirmBooking}
          >
            Confirm booking
          </button>

        </section>

        {/* RIGHT SIDE */}
        <section className="reservation-card">

          <div className="hotel-summary">

            <img
              src={hotel.image}
              alt={hotel.name || "Hotel"}
            />

            <div className="hotel-summary-info">

              <h3>{hotel.name}</h3>

              <p>
                {hotel.city}, {hotel.state}
              </p>

              <span className="hotel-summary-rating">
                ★ {hotel.rating}
              </span>

            </div>

          </div>

          <div className="reservation-divider"></div>

          <p className="protected-text">
            Your booking is protected by{" "}
            <strong>TravelOcover</strong>
          </p>

          <div className="reservation-divider"></div>

          <h2>Price details</h2>

          <div className="price-detail-row">
            <span>
              Rs. {Number(roomTotal / nights || 0).toLocaleString("en-IN")}
              {" × "}
              {nights} nights
            </span>

            <span>
              Rs. {Number(roomTotal || 0).toLocaleString("en-IN")}
            </span>
          </div>

          <div className="price-detail-row">
            <span>Service fee</span>

            <span>
              Rs. {Number(serviceFee || 0).toLocaleString("en-IN")}
            </span>
          </div>

          <div className="price-total-row">
            <span>Total</span>

            <span>
              Rs. {Number(total || 0).toLocaleString("en-IN")}
            </span>
          </div>

        </section>

      </div>
    </main>
  );
};

export default OrderSummary;
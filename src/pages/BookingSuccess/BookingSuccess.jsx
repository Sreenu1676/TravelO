import { useNavigate } from "react-router-dom";
import "./BookingSuccess.css";

const BookingSuccess = () => {
  const navigate = useNavigate();

  const handleContinueBooking = () => {
    navigate("/");
  };

  return (
    <main className="booking-success-page">

      <div className="success-content">

        <div className="success-icon">
          <span>✓</span>
        </div>

        <h1>
          Stay Booked Successfully
        </h1>

        <button
          type="button"
          className="continue-booking-button"
          onClick={handleContinueBooking}
        >
          Continue Booking
        </button>

      </div>

    </main>
  );
};

export default BookingSuccess;
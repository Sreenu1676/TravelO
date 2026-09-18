import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context";
import "./Wishlist.css";

const Wishlist = () => {
  const navigate = useNavigate();

  const { accessToken, authDispatch } = useAuth();

  const [wishlist, setWishlist] = useState([]);

  const loadWishlist = () => {
    if (!accessToken) {
      setWishlist([]);
      return;
    }

    const savedWishlist =
      JSON.parse(localStorage.getItem("wishlist")) || [];

    setWishlist(savedWishlist);
  };

  useEffect(() => {
    /*
    If user is logged out,
    don't show wishlist.
    */

    if (!accessToken) {
      setWishlist([]);
      return;
    }

    loadWishlist();

    const handleWishlistUpdate = () => {
      loadWishlist();
    };

    window.addEventListener(
      "wishlistUpdated",
      handleWishlistUpdate
    );

    return () => {
      window.removeEventListener(
        "wishlistUpdated",
        handleWishlistUpdate
      );
    };
  }, [accessToken]);

  /*
  =========================================
  REMOVE HOTEL
  =========================================
  */

  const removeFromWishlist = (hotelId) => {
    if (!accessToken) {
      authDispatch({
        type: "SHOW_AUTH_MODAL",
      });

      return;
    }

    const updatedWishlist = wishlist.filter(
      (hotel) => hotel._id !== hotelId
    );

    localStorage.setItem(
      "wishlist",
      JSON.stringify(updatedWishlist)
    );

    setWishlist(updatedWishlist);

    window.dispatchEvent(
      new Event("wishlistUpdated")
    );
  };

  /*
  =========================================
  HOTEL CLICK
  =========================================
  */

  const handleHotelClick = (hotel) => {
    navigate(
      `/hotels/${hotel.name}/${hotel.address}-${hotel.state}/${hotel._id}/reserve`
    );
  };

  /*
  =========================================
  LOGGED OUT
  =========================================
  */

  if (!accessToken) {
    return (
      <div className="wishlist-page">

        <div className="wishlist-empty">

          <span className="material-icons-outlined">
            favorite_border
          </span>

          <h2>
            Login to view your wishlist
          </h2>

          <p>
            Sign in to save and view your
            favorite stays.
          </p>

          <button
            type="button"
            onClick={() => {
              authDispatch({
                type: "SHOW_AUTH_MODAL",
              });
            }}
          >
            Login
          </button>

        </div>

      </div>
    );
  }

  /*
  =========================================
  LOGGED IN
  =========================================
  */

  return (
    <div className="wishlist-page">

      <div className="wishlist-header">

        <h1>
          Wishlist
        </h1>

        <p>
          {wishlist.length}{" "}
          {wishlist.length === 1
            ? "hotel"
            : "hotels"}{" "}
          saved
        </p>

      </div>

      {wishlist.length === 0 ? (
        <div className="wishlist-empty">

          <span className="material-icons-outlined">
            favorite_border
          </span>

          <h2>
            Your wishlist is empty
          </h2>

          <p>
            Save hotels you love and find
            them here.
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
          >
            Explore hotels
          </button>

        </div>
      ) : (
        <div className="wishlist-grid">

          {wishlist.map((hotel) => (

            <div
              className="wishlist-card"
              key={hotel._id}
            >

              <div
                className="wishlist-image-container"
                onClick={() =>
                  handleHotelClick(hotel)
                }
              >

                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="wishlist-image"
                />

                <button
                  type="button"
                  className="wishlist-remove"
                  onClick={(event) => {
                    event.stopPropagation();

                    removeFromWishlist(
                      hotel._id
                    );
                  }}
                >
                  <span className="material-icons-outlined">
                    favorite
                  </span>
                </button>

              </div>

              <div
                className="wishlist-details"
                onClick={() =>
                  handleHotelClick(hotel)
                }
              >

                <div className="wishlist-location-rating">

                  <span>
                    {hotel.address},{" "}
                    {hotel.state}
                  </span>

                  <span>
                    <span className="material-icons-outlined">
                      star
                    </span>

                    {hotel.rating}
                  </span>

                </div>

                <h3>
                  {hotel.name}
                </h3>

                <p>
                  Rs.{" "}
                  {Number(
                    hotel.price || 0
                  ).toLocaleString("en-IN")}{" "}
                  night
                </p>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
};

export default Wishlist;
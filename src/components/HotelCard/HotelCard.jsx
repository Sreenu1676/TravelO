import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context";
import "./HotelCard.css";

export const HotelCard = ({ hotel }) => {
  const navigate = useNavigate();

  const { accessToken, authDispatch } = useAuth();

  const {
    _id,
    name,
    image,
    address,
    state,
    rating,
    price,
  } = hotel;

  const [isWishlisted, setIsWishlisted] = useState(false);

  /*
  =========================================
  CHECK WISHLIST STATUS
  =========================================
  */

  useEffect(() => {
    // If user is not logged in,
    // don't show this hotel as wishlisted.
    if (!accessToken) {
      setIsWishlisted(false);
      return;
    }

    const wishlist =
      JSON.parse(localStorage.getItem("wishlist")) || [];

    const exists = wishlist.some(
      (item) => item._id === _id
    );

    setIsWishlisted(exists);
  }, [_id, accessToken]);

  /*
  =========================================
  HOTEL CARD CLICK
  =========================================
  */

  const handleHotelCardClick = () => {
    navigate(
      `/hotels/${name}/${address}-${state}/${_id}/reserve`
    );
  };

  /*
  =========================================
  WISHLIST CLICK
  =========================================
  */

  const handleWishlistClick = (event) => {
    event.stopPropagation();

    /*
    USER IS NOT LOGGED IN
    */

    if (!accessToken) {
      // Open existing login modal
      authDispatch({
        type: "SHOW_AUTH_MODAL",
      });

      return;
    }

    /*
    USER IS LOGGED IN
    */

    const wishlist =
      JSON.parse(localStorage.getItem("wishlist")) || [];

    const exists = wishlist.some(
      (item) => item._id === _id
    );

    let updatedWishlist;

    if (exists) {
      /*
      REMOVE FROM WISHLIST
      */

      updatedWishlist = wishlist.filter(
        (item) => item._id !== _id
      );

      setIsWishlisted(false);
    } else {
      /*
      ADD TO WISHLIST
      */

      updatedWishlist = [
        ...wishlist,
        hotel,
      ];

      setIsWishlisted(true);
    }

    localStorage.setItem(
      "wishlist",
      JSON.stringify(updatedWishlist)
    );

    /*
    Tell Wishlist page that something changed.
    */

    window.dispatchEvent(
      new Event("wishlistUpdated")
    );
  };

  return (
    <div className="relative hotelcard-container shadow cursor-pointer">

      <div onClick={handleHotelCardClick}>

        <img
          className="img"
          src={image}
          alt={name || "Hotel"}
        />

        <div className="hotelcard-details">

          <div className="d-flex align-center">

            <span className="location">
              {address}, {state}
            </span>

            <span className="rating d-flex align-center">

              <span className="material-icons-outlined">
                star
              </span>

              <span>
                {rating}
              </span>

            </span>

          </div>

          <p className="hotel-name">
            {name}
          </p>

          <p className="price-details">

            <span className="price">
              Rs.{" "}
              {Number(
                price || 0
              ).toLocaleString("en-IN")}
            </span>

            <span>
              {" "}night
            </span>

          </p>

        </div>

      </div>

      <button
        type="button"
        className="button btn-wishlist absolute"
        onClick={handleWishlistClick}
        aria-label={
          isWishlisted
            ? "Remove from wishlist"
            : "Add to wishlist"
        }
      >


    <span
  className={`material-icons-outlined favorite ${
    isWishlisted ? "wishlisted" : ""
  }`}
>
  {isWishlisted ? "favorite" : "favorite_border"}
</span>
      </button>

    </div>
  );
};
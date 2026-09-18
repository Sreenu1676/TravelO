import "./Navbar.css";
import { useNavigate } from "react-router-dom";

import { useDate, useAuth } from "../../context";
import { AuthModal } from "../AuthModal/AuthModal";

export const Navbar = () => {
  const navigate = useNavigate();

  const {
    destination,
    dateDispatch,
    checkInDate,
    checkOutDate,
    guests,
  } = useDate();

  const {
    accessToken,
    name,
    isAuthModalOpen,
    isDropDownModalOpen,
    authDispatch,
  } = useAuth();

  // SEARCH
  const handleSearchClick = () => {
    dateDispatch({
      type: "OPEN_SEARCH_MODAL",
    });
  };

  // PROFILE BUTTON
  const handlePersonClick = () => {
    if (accessToken) {
      authDispatch({
        type: "SHOW_DROP_DOWN_OPTIONS",
      });
    } else {
      authDispatch({
        type: "SHOW_AUTH_MODAL",
      });
    }
  };

  // WISHLIST
  const handleWishlistClick = () => {
    authDispatch({
      type: "SHOW_DROP_DOWN_OPTIONS",
    });

    navigate("/wishlist");
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    authDispatch({
      type: "CLEAR_CREDENTIALS",
    });

    authDispatch({
      type: "SHOW_DROP_DOWN_OPTIONS",
    });

    navigate("/");
  };

  const displayName =
    name ||
    localStorage.getItem("username") ||
    "User";

  return (
    <>
      <header className="heading d-flex align-center">

        {/* LOGO */}
        <h1 className="heading-1">
          <a className="link" href="/">
            TravelO
          </a>
        </h1>

        {/* SEARCH BAR */}
        <div
          className="form-container d-flex align-center cursor-pointer shadow"
          onClick={handleSearchClick}
        >
          <span className="form-option">
            {destination || "Any Where"}
          </span>

          <span className="border-right-1-px"></span>

          <span className="form-option">
            {checkInDate && checkOutDate
              ? `${checkInDate.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                })} - ${checkOutDate.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                })}`
              : "Any Week"}
          </span>

          <span className="border-right-1-px"></span>

          <span className="form-option">
            {guests > 0
              ? `${guests} guests`
              : "Add Guests"}
          </span>

          <span className="search material-icons-outlined">
            search
          </span>
        </div>

        {/* RIGHT SIDE */}
        <nav className="navbar-right">

          {/* USER NAME - OUTSIDE PROFILE BOX */}
          {accessToken && (
            <span className="navbar-user-name">
              Hi, {displayName}
            </span>
          )}

          {/* PROFILE BOX */}
          <div className="nav">

            {/* MENU */}
            <span className="material-icons-outlined profile-option menu">
              menu
            </span>

            {/* PERSON */}
            <span
              className="material-icons-outlined profile-option person cursor-pointer"
              onClick={handlePersonClick}
            >
              person_2
            </span>

          </div>

          {/* DROPDOWN */}
          {accessToken && isDropDownModalOpen && (
            <div className="user-dropdown">

              {/* WISHLIST */}
              <button
                type="button"
                className="wishlist-button"
                onClick={handleWishlistClick}
              >
                <span className="material-icons-outlined">
                  favorite_border
                </span>

                <span>Wishlist</span>
              </button>

              {/* LOGOUT */}
              <button
                type="button"
                className="logout-button"
                onClick={handleLogout}
              >
                <span className="material-icons-outlined">
                  logout
                </span>

                <span>Logout</span>
              </button>

            </div>
          )}

        </nav>

      </header>

      {/* LOGIN / SIGNUP MODAL */}
      {isAuthModalOpen && <AuthModal />}
    </>
  );
};
import { useEffect, useState } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";

import "./Home.css";
import { HotelCard } from "../../components/HotelCard/HotelCard";
import { Categories } from "../../components/Categories/Categories";
import { useCategory } from "../../context/category-context";

const API_URL = "/api/hotels";
const PAGE_SIZE = 16;

/* =====================================================
   UNIQUE HOTEL KEY
===================================================== */

const getHotelKey = (hotel) => {
  return [
    hotel?._id,
    hotel?.name,
    hotel?.address,
    hotel?.city,
    hotel?.state,
  ]
    .map((value) =>
      String(value ?? "")
        .trim()
        .toLowerCase()
    )
    .join("|");
};

/* =====================================================
   REMOVE DUPLICATES
===================================================== */

const removeDuplicates = (hotels) => {
  const seen = new Set();

  return hotels.filter((hotel) => {
    const key = getHotelKey(hotel);

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
};

/* =====================================================
   GET PRICE
===================================================== */

const getPrice = (hotel) => {
  const value = hotel?.price;

  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  const price = Number(
    String(value).replace(/[₹,\s]/g, "")
  );

  if (Number.isNaN(price)) {
    return null;
  }

  return price;
};

/* =====================================================
   GET RATING
===================================================== */

const getRating = (hotel) => {
  const value = hotel?.rating;

  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  const rating = Number(value);

  if (Number.isNaN(rating)) {
    return null;
  }

  return rating;
};

/* =====================================================
   HOME
===================================================== */

const Home = () => {
  const { hotelCategory } = useCategory();

  /* ===================================================
     HOTEL DATA
  =================================================== */

  const [categoryHotels, setCategoryHotels] =
    useState([]);

  const [filteredHotels, setFilteredHotels] =
    useState([]);

  const [hotels, setHotels] =
    useState([]);

  /* ===================================================
     LOADING
  =================================================== */

  const [loading, setLoading] =
    useState(true);

  const [hasMore, setHasMore] =
    useState(false);

  /* ===================================================
     FILTER POPUP
  =================================================== */

  const [showFilters, setShowFilters] =
    useState(false);

  /* ===================================================
     PRICE SLIDER
  =================================================== */

  const [databaseMinPrice, setDatabaseMinPrice] =
    useState(0);

  const [databaseMaxPrice, setDatabaseMaxPrice] =
    useState(10000);

  const [selectedPrice, setSelectedPrice] =
    useState(5000);

  /* ===================================================
     BEDROOMS
  =================================================== */

  const [bedrooms, setBedrooms] =
    useState("");

  /* ===================================================
     BEDS
  =================================================== */

  const [beds, setBeds] =
    useState("");

  /* ===================================================
     BATHROOMS
  =================================================== */

  const [bathrooms, setBathrooms] =
    useState("");

  /* ===================================================
     GUEST RATING
  =================================================== */

  const [guestRating, setGuestRating] =
    useState("");

  /* ===================================================
     LOAD HOTELS
  =================================================== */

  useEffect(() => {
    let cancelled = false;

    const loadHotels = async () => {
      setLoading(true);

      try {
        const response =
          await axios.get(API_URL);

        if (cancelled) {
          return;
        }

        if (!Array.isArray(response.data)) {
          console.error(
            "Hotel API did not return an array:",
            response.data
          );

          setCategoryHotels([]);
          setFilteredHotels([]);
          setHotels([]);
          setHasMore(false);

          return;
        }

        /* ===============================================
           REMOVE DUPLICATES
        =============================================== */

        const uniqueHotels =
          removeDuplicates(
            response.data
          );

        console.log(
          "Total API hotels:",
          response.data.length
        );

        console.log(
          "Unique hotels:",
          uniqueHotels.length
        );

        /* ===============================================
           HOTEL ORDER
        =============================================== */

        const hotelOrder = [
          "Whispering Pines Cottages",
          "Sun View Mountain",
          "Himalayan Valley Lodge",
          "Pine Forest Retreat",
          "RiverTree Duplex- Riverside Plantation TreehouseAC",
          "Little Valley Home",
          "Cozy Mountain Tiny House",
          "Green Valley Farm Stay",
          "Mango Orchard Farm",
          "Countryside Organic Farm",
          "Hilltop Farm Cottage",
          "Fairway Hills Golf Retreat",
          "Green Links Estate",
          "Royal Fairways Retreat",
          "Blue Lagoon Island Villa",
          "Coral Bay Island Stay",
          "Palm Shore Island Retreat",
          "Sunset Island Escape",
          "Mountain Campervan Escape",
          "Coastal Campervan Camp",
          "Desert Campervan Journey",
          "Pinewood Forest Cabin",
          "Snowline Mountain Cabin",
          "Cedar Creek Cabin",
          "Lakeside Timber Cabin",
          "Minimalist Hillside Home",
          "Modern Courtyard Villa",
          "Architectural Lake House",
          "Infinity Pool Villa",
          "Palm View Pool Retreat",
          "Mountain Infinity Pool",
          "Tropical Blue Pool House",
          "Lakeview Glass House",
          "Lakeside Serenity Retreat",
          "Blue Lakefront Cottage",
          "Sunset Lake House",
        ];

        const orderedHotels =
          [...uniqueHotels].sort(
            (a, b) => {
              const indexA =
                hotelOrder.indexOf(a.name);

              const indexB =
                hotelOrder.indexOf(b.name);

              if (indexA === -1) {
                return 1;
              }

              if (indexB === -1) {
                return -1;
              }

              return indexA - indexB;
            }
          );

        /* ===============================================
           FIND ACTUAL PRICE RANGE
        =============================================== */

        const prices =
          uniqueHotels
            .map(getPrice)
            .filter(
              (price) =>
                price !== null
            );

        if (prices.length > 0) {
          const actualMin =
            Math.min(...prices);

          const actualMax =
            Math.max(...prices);

          setDatabaseMinPrice(
            actualMin
          );

          setDatabaseMaxPrice(
            actualMax
          );

          /*
            Start at maximum price.
            Maximum means "Any price".
          */

          setSelectedPrice(
            actualMax
          );
        }

        /* ===============================================
           CATEGORY FILTER
        =============================================== */

        const selectedCategory =
          String(
            hotelCategory || ""
          )
            .trim()
            .toLowerCase();

        let result =
          orderedHotels;

        /*
          Empty string means All Hotels.
        */

        if (
          selectedCategory !== "" &&
          selectedCategory !== "all hotels"
        ) {
          result =
            orderedHotels.filter(
              (hotel) => {
                const category =
                  String(
                    hotel?.category || ""
                  )
                    .trim()
                    .toLowerCase();

                return (
                  category ===
                  selectedCategory
                );
              }
            );
        }

        console.log(
          "Selected category:",
          hotelCategory ||
          "All Hotels"
        );

        console.log(
          "Hotels after category:",
          result.length
        );

        /* ===============================================
           SAVE
        =============================================== */

        setCategoryHotels(result);

        setFilteredHotels(result);

        /* ===============================================
           FIRST PAGE
        =============================================== */

        setHotels(
          result.slice(
            0,
            PAGE_SIZE
          )
        );

        setHasMore(
          result.length >
          PAGE_SIZE
        );

      } catch (error) {
        console.error(
          "Failed to load hotels:",
          error
        );

        setCategoryHotels([]);
        setFilteredHotels([]);
        setHotels([]);
        setHasMore(false);

      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadHotels();

    return () => {
      cancelled = true;
    };

  }, [hotelCategory]);

  /* =====================================================
     APPLY FILTERS
  ===================================================== */

  const applyFilters = () => {

    /*
      ALWAYS start with current category hotels.
    */

    let result =
      [...categoryHotels];

    /* =================================================
       PRICE RANGE

       Price is grouped into ₹1000 ranges.

       Example:

       selectedPrice = 3478

       start = 3000
       end   = 4000

       3000 <= price <= 4000

       IMPORTANT:
       If slider is at maximum price,
       price filtering is NOT applied.
       Maximum means "Any price".
    ================================================= */

    const priceStart =
      Math.floor(
        Number(selectedPrice) / 1000
      ) * 1000;

    const priceEnd =
      priceStart + 1000;

    if (
      Number(selectedPrice) <
      Number(databaseMaxPrice)
    ) {
      result =
        result.filter((hotel) => {

          const price =
            getPrice(hotel);

          if (price === null) {
            return false;
          }

          return (
            price >= priceStart &&
            price <= priceEnd
          );
        });
    }

    /* =================================================
       BEDROOMS
    ================================================= */

    if (bedrooms !== "") {

      result =
        result.filter((hotel) => {

          const value =
            Number(
              hotel?.numberOfBedrooms
            );

          if (
            Number.isNaN(value)
          ) {
            return false;
          }

          if (
            bedrooms === "5+"
          ) {
            return value >= 5;
          }

          return (
            value ===
            Number(bedrooms)
          );
        });
    }

    /* =================================================
       BEDS
    ================================================= */

    if (beds !== "") {

      result =
        result.filter((hotel) => {

          const value =
            Number(
              hotel?.numberOfBeds
            );

          if (
            Number.isNaN(value)
          ) {
            return false;
          }

          if (
            beds === "5+"
          ) {
            return value >= 5;
          }

          return (
            value ===
            Number(beds)
          );
        });
    }

    /* =================================================
       BATHROOMS
    ================================================= */

    if (bathrooms !== "") {

      result =
        result.filter((hotel) => {

          const value =
            Number(
              hotel?.numberOfBathrooms
            );

          if (
            Number.isNaN(value)
          ) {
            return false;
          }

          if (
            bathrooms === "5+"
          ) {
            return value >= 5;
          }

          return (
            value ===
            Number(bathrooms)
          );
        });
    }

    /* =================================================
       GUEST RATING
    ================================================= */

    if (guestRating !== "") {

      result =
        result.filter((hotel) => {

          const rating =
            getRating(hotel);

          if (
            rating === null
          ) {
            return false;
          }

          if (
            guestRating === "4"
          ) {
            return rating >= 4;
          }

          if (
            guestRating === "4.5"
          ) {
            return rating >= 4.5;
          }

          return true;
        });
    }

    /* =================================================
       REMOVE DUPLICATES
    ================================================= */

    result =
      removeDuplicates(result);

    /* =================================================
       DEBUG
    ================================================= */

    console.log(
      "================================"
    );

    console.log(
      "Selected price:",
      selectedPrice
    );

    console.log(
      "Price range:",
      priceStart,
      "-",
      priceEnd
    );

    console.log(
      "Price filter applied:",
      Number(selectedPrice) <
      Number(databaseMaxPrice)
    );

    console.log(
      "Bedrooms:",
      bedrooms || "Any"
    );

    console.log(
      "Beds:",
      beds || "Any"
    );

    console.log(
      "Bathrooms:",
      bathrooms || "Any"
    );

    console.log(
      "Guest rating:",
      guestRating || "Any"
    );

    console.log(
      "Hotels found:",
      result.length
    );

    console.log(
      "================================"
    );

    /* =================================================
       SAVE RESULTS
    ================================================= */

    setFilteredHotels(result);

    setHotels(
      result.slice(
        0,
        PAGE_SIZE
      )
    );

    setHasMore(
      result.length >
      PAGE_SIZE
    );

    setShowFilters(false);
  };

  /* =====================================================
     CLEAR FILTERS
  ===================================================== */

  const clearFilters = () => {

    setSelectedPrice(
      databaseMaxPrice
    );

    setBedrooms("");

    setBeds("");

    setBathrooms("");

    setGuestRating("");

    setFilteredHotels(
      categoryHotels
    );

    setHotels(
      categoryHotels.slice(
        0,
        PAGE_SIZE
      )
    );

    setHasMore(
      categoryHotels.length >
      PAGE_SIZE
    );
  };

  /* =====================================================
     LOAD MORE
  ===================================================== */

  const loadMoreHotels = () => {

    const currentLength =
      hotels.length;

    if (
      currentLength >=
      filteredHotels.length
    ) {
      setHasMore(false);
      return;
    }

    const nextHotels =
      filteredHotels.slice(
        currentLength,
        currentLength + PAGE_SIZE
      );

    if (
      nextHotels.length === 0
    ) {
      setHasMore(false);
      return;
    }

    setHotels(
      (previous) => [
        ...previous,
        ...nextHotels,
      ]
    );

    if (
      currentLength +
      nextHotels.length >=
      filteredHotels.length
    ) {
      setHasMore(false);
    }
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="home-container">

        <Categories
          onFilterClick={() =>
            setShowFilters(true)
          }
        />

        <h3 className="alert-text">
          Loading hotels...
        </h3>

      </div>
    );
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div className="home-container">

      {/* CATEGORIES */}

      <Categories
        onFilterClick={() =>
          setShowFilters(true)
        }
      />

      {/* =================================================
          FILTER POPUP
      ================================================= */}

      {showFilters && (

        <div
          className="filter-overlay"
          onClick={() =>
            setShowFilters(false)
          }
        >

          <div
            className="filter-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* =========================================
                HEADER
            ========================================= */}

            <div className="filter-modal-header">

              <h2>
                Filters
              </h2>

              <button
                type="button"
                className="filter-close-button"
                onClick={() =>
                  setShowFilters(false)
                }
              >
                ×
              </button>

            </div>

            {/* =========================================
                PRICE RANGE
            ========================================= */}

            <section className="filter-section">

              <h3>
                Price Range
              </h3>

              <div className="price-values">

                <span>
                  ₹
                  {(
                    Math.floor(
                      selectedPrice / 1000
                    ) * 1000
                  ).toLocaleString(
                    "en-IN"
                  )}
                </span>

                <span>
                  ₹
                  {(
                    Math.floor(
                      selectedPrice / 1000
                    ) * 1000 +
                    1000
                  ).toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>

              <input
                type="range"
                min={
                  databaseMinPrice
                }
                max={
                  databaseMaxPrice
                }
                value={
                  selectedPrice
                }
                onChange={(event) => {

                  setSelectedPrice(
                    Number(
                      event.target.value
                    )
                  );

                }}
                className="price-range-single"
              />

              <p className="selected-price-text">

                Selected:
                {" "}
                ₹
                {Number(
                  selectedPrice
                ).toLocaleString(
                  "en-IN"
                )}

              </p>

              <p className="selected-price-range">

                Showing hotels from
                {" "}
                ₹
                {(
                  Math.floor(
                    selectedPrice / 1000
                  ) * 1000
                ).toLocaleString(
                  "en-IN"
                )}

                {" "}–{" "}

                ₹
                {(
                  Math.floor(
                    selectedPrice / 1000
                  ) * 1000 +
                  1000
                ).toLocaleString(
                  "en-IN"
                )}

              </p>

            </section>

            {/* =========================================
                ROOMS AND BEDS
            ========================================= */}

            <section className="filter-section">

              <h3>
                Rooms And Beds
              </h3>

              {/* BEDROOMS */}

              <div className="filter-row">

                <span className="filter-label">
                  Bedrooms
                </span>

                <div className="filter-options">

                  {[
                    "",
                    "1",
                    "2",
                    "3",
                    "4",
                    "5+",
                  ].map((value) => (

                    <button
                      key={
                        value ||
                        "bedroom-any"
                      }
                      type="button"
                      className={
                        bedrooms === value
                          ? "filter-option active"
                          : "filter-option"
                      }
                      onClick={() =>
                        setBedrooms(
                          value
                        )
                      }
                    >
                      {value === ""
                        ? "Any"
                        : value}
                    </button>

                  ))}

                </div>

              </div>

              {/* BEDS */}

              <div className="filter-row">

                <span className="filter-label">
                  Beds
                </span>

                <div className="filter-options">

                  {[
                    "",
                    "1",
                    "2",
                    "3",
                    "4",
                    "5+",
                  ].map((value) => (

                    <button
                      key={
                        value ||
                        "beds-any"
                      }
                      type="button"
                      className={
                        beds === value
                          ? "filter-option active"
                          : "filter-option"
                      }
                      onClick={() =>
                        setBeds(
                          value
                        )
                      }
                    >
                      {value === ""
                        ? "Any"
                        : value}
                    </button>

                  ))}

                </div>

              </div>

              {/* BATHROOMS */}

              <div className="filter-row">

                <span className="filter-label">
                  Bathrooms
                </span>

                <div className="filter-options">

                  {[
                    "",
                    "1",
                    "2",
                    "3",
                    "4",
                    "5+",
                  ].map((value) => (

                    <button
                      key={
                        value ||
                        "bathroom-any"
                      }
                      type="button"
                      className={
                        bathrooms === value
                          ? "filter-option active"
                          : "filter-option"
                      }
                      onClick={() =>
                        setBathrooms(
                          value
                        )
                      }
                    >
                      {value === ""
                        ? "Any"
                        : value}
                    </button>

                  ))}

                </div>

              </div>

            </section>

            {/* =========================================
                GUEST RATING
            ========================================= */}

            <section className="filter-section">

              <h3>
                Guest Rating
              </h3>

              <div className="filter-options">

                <button
                  type="button"
                  className={
                    guestRating === ""
                      ? "filter-option active"
                      : "filter-option"
                  }
                  onClick={() =>
                    setGuestRating("")
                  }
                >
                  Any
                </button>

                <button
                  type="button"
                  className={
                    guestRating === "4"
                      ? "filter-option active"
                      : "filter-option"
                  }
                  onClick={() =>
                    setGuestRating("4")
                  }
                >
                  4+ ★
                </button>

                <button
                  type="button"
                  className={
                    guestRating === "4.5"
                      ? "filter-option active"
                      : "filter-option"
                  }
                  onClick={() =>
                    setGuestRating("4.5")
                  }
                >
                  4.5+ ★
                </button>

              </div>

            </section>

            {/* =========================================
                ACTIONS
            ========================================= */}

            <div className="filter-modal-actions">

              <button
                type="button"
                className="clear-all-button"
                onClick={
                  clearFilters
                }
              >
                Clear all
              </button>

              <button
                type="button"
                className="show-results-button"
                onClick={
                  applyFilters
                }
              >
                Show results
              </button>

            </div>

          </div>

        </div>
      )}

      {/* =================================================
          HOTELS
      ================================================= */}

      {hotels.length > 0 ? (

        <InfiniteScroll

          dataLength={
            hotels.length
          }

          next={
            loadMoreHotels
          }

          hasMore={
            hasMore
          }

          loader={
            <h3 className="alert-text">
              Loading...
            </h3>
          }

          endMessage={
            <p className="alert-text">
              {/* You have seen it all! */}
            </p>
          }

        >

          <main className="main">

            {hotels.map((hotel) => (

              <HotelCard
                key={
                  getHotelKey(hotel)
                }
                hotel={hotel}
              />

            ))}

          </main>

        </InfiniteScroll>

      ) : (

        <h3 className="alert-text">
          No hotels found.
        </h3>

      )}

    </div>
  );
};

export default Home;
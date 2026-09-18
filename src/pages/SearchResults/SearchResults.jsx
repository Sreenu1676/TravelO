import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import "./SearchResults.css";

import { HotelCard } from "../../components/HotelCard/HotelCard";
import { Categories } from "../../components/Categories/Categories";

import { useDate, useCategory } from "../../context";

const SearchResults = () => {
  const { destination } = useDate();
  const { hotelCategory } = useCategory();

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================================
     LOAD HOTELS
  ========================================= */

  useEffect(() => {
    const getHotels = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          "/api/hotels"
        );

        const data = response.data;

        console.log(
          "Search page hotels:",
          data
        );

        setHotels(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (error) {
        console.error(
          "Failed to load search results:",
          error
        );

        setHotels([]);
      } finally {
        setLoading(false);
      }
    };

    getHotels();
  }, []);

  /* =========================================
     FILTER HOTELS
  ========================================= */

  const filteredHotels = useMemo(() => {
    const selectedCategory = String(
      hotelCategory || ""
    )
      .trim()
      .toLowerCase();

    const searchDestination = String(
      destination || ""
    )
      .trim()
      .toLowerCase();

    return hotels.filter((hotel) => {

      /* =====================================
         CATEGORY
      ===================================== */

      const hotelCategoryValue = String(
        hotel?.category || ""
      )
        .trim()
        .toLowerCase();

      const categoryMatches =
        selectedCategory === "" ||
        selectedCategory === "all hotels" ||
        hotelCategoryValue ===
          selectedCategory;

      if (!categoryMatches) {
        return false;
      }

      /* =====================================
         DESTINATION
      ===================================== */

      if (!searchDestination) {
        return true;
      }

      const address = String(
        hotel?.address || ""
      )
        .trim()
        .toLowerCase();

      const city = String(
        hotel?.city || ""
      )
        .trim()
        .toLowerCase();

      const state = String(
        hotel?.state || ""
      )
        .trim()
        .toLowerCase();

      /* =====================================
         CREATE SAME DESTINATION FORMAT
         
         Example:

         address = Bir
         city = Joginder Nagar Valley

         destination =
         Bir, Joginder Nagar Valley
      ===================================== */

      const combinedDestination =
        address && city
          ? `${address}, ${city}`
          : address || city || state;

      const combinedLower =
        combinedDestination
          .toLowerCase();

      /* =====================================
         MATCH
      ===================================== */

      return (
        combinedLower ===
          searchDestination ||

        address ===
          searchDestination ||

        city ===
          searchDestination ||

        state ===
          searchDestination ||

        combinedLower.includes(
          searchDestination
        )
      );
    });
  }, [
    hotels,
    destination,
    hotelCategory,
  ]);

  /* =========================================
     DEBUG
  ========================================= */

  console.log(
    "Selected destination:",
    destination || "All destinations"
  );

  console.log(
    "Selected category:",
    hotelCategory || "All Hotels"
  );

  console.log(
    "Hotels before filtering:",
    hotels.length
  );

  console.log(
    "Hotels after filtering:",
    filteredHotels.length
  );

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <>
        <Categories />

        <main className="search-results-container">

          <h2>
            Loading hotels...
          </h2>

        </main>
      </>
    );
  }

  /* =========================================
     RESULTS
  ========================================= */

  return (
    <>
      <Categories />

      <main className="search-results-container">

        {filteredHotels.length > 0 ? (

          filteredHotels.map((hotel) => (
            <HotelCard
              key={
                hotel._id ||
                hotel.id
              }
              hotel={hotel}
            />
          ))

        ) : (

          <div className="no-results">

            <h2>
              No hotels found
              {destination
                ? ` for ${destination}`
                : ""}
            </h2>

            <p>
              Try another destination.
            </p>

          </div>

        )}

      </main>
    </>
  );
};

export default SearchResults;

// import { useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import "./SearchResults.css";
// import { HotelCard } from "../../components/HotelCard/HotelCard";
// import { Categories } from "../../components/Categories/Categories";
// import { useDate, useCategory } from "../../context";

// const SearchResults = () => {
//   const { destination } = useDate();
//   const { hotelCategory } = useCategory();

//   const [hotels, setHotels] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Original hotel order from data/hotels.js
//   const hotelOrder = [
//     "Whispering Pines Cottages",
//     "Sun View Mountain",
//     "Himalayan Valley Lodge",
//     "Pine Forest Retreat",
//     "RiverTree Duplex- Riverside Plantation TreehouseAC",
//     "Little Valley Home",
//     "Cozy Mountain Tiny House",
//     "Green Valley Farm Stay",
//     "Mango Orchard Farm",
//     "Countryside Organic Farm",
//     "Hilltop Farm Cottage",
//     "Fairway Hills Golf Retreat",
//     "Green Links Estate",
//     "Royal Fairways Retreat",
//     "Blue Lagoon Island Villa",
//     "Coral Bay Island Stay",
//     "Palm Shore Island Retreat",
//     "Sunset Island Escape",
//     "Mountain Campervan Escape",
//     "Coastal Campervan Camp",
//     "Desert Campervan Journey",
//     "Pinewood Forest Cabin",
//     "Snowline Mountain Cabin",
//     "Cedar Creek Cabin",
//     "Lakeside Timber Cabin",
//     "Minimalist Hillside Home",
//     "Modern Courtyard Villa",
//     "Architectural Lake House",
//     "Infinity Pool Villa",
//     "Palm View Pool Retreat",
//     "Mountain Infinity Pool",
//     "Tropical Blue Pool House",
//     "Lakeview Glass House",
//     "Lakeside Serenity Retreat",
//     "Blue Lakefront Cottage",
//     "Sunset Lake House",
//   ];

//   useEffect(() => {
//     const getHotels = async () => {
//       try {
//         setLoading(true);

//         const response = await axios.get("/api/hotels");

//         const data = Array.isArray(response.data)
//           ? response.data
//           : [];

//         setHotels(data);
//       } catch (error) {
//         console.error("Failed to load search results:", error);
//         setHotels([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     getHotels();
//   }, []);

//   const filteredHotels = useMemo(() => {
//     const selectedCategory = String(hotelCategory || "")
//       .trim()
//       .toLowerCase();

//     const searchDestination = String(destination || "")
//       .trim()
//       .toLowerCase();

//     const filtered = hotels.filter((hotel) => {
//       const hotelCategoryValue = String(hotel?.category || "")
//         .trim()
//         .toLowerCase();

//       const categoryMatches =
//         selectedCategory === "" ||
//         selectedCategory === "all hotels" ||
//         hotelCategoryValue === selectedCategory;

//       if (!categoryMatches) {
//         return false;
//       }

//       if (!searchDestination) {
//         return true;
//       }

//       const address = String(hotel?.address || "")
//         .trim()
//         .toLowerCase();

//       const city = String(hotel?.city || "")
//         .trim()
//         .toLowerCase();

//       const state = String(hotel?.state || "")
//         .trim()
//         .toLowerCase();

//       const combinedDestination =
//         address && city
//           ? `${address}, ${city}`
//           : address || city || state;

//       return (
//         combinedDestination === searchDestination ||
//         address === searchDestination ||
//         city === searchDestination ||
//         state === searchDestination ||
//         combinedDestination.includes(searchDestination)
//       );
//     });

//     // Restore original hotel order
//     return [...filtered].sort((a, b) => {
//       const indexA = hotelOrder.indexOf(a.name);
//       const indexB = hotelOrder.indexOf(b.name);

//       return (
//         (indexA === -1 ? 999 : indexA) -
//         (indexB === -1 ? 999 : indexB)
//       );
//     });
//   }, [hotels, destination, hotelCategory]);

//   if (loading) {
//     return (
//       <>
//         <Categories />

//         <main className="search-results-container">
//           <h2>Loading hotels...</h2>
//         </main>
//       </>
//     );
//   }

//   return (
//     <>
//       <Categories />

//       <main className="search-results-container">
//         {filteredHotels.length > 0 ? (
//           filteredHotels.map((hotel) => (
//             <HotelCard
//               key={hotel._id || hotel.id}
//               hotel={hotel}
//             />
//           ))
//         ) : (
//           <div className="no-results">
//             <h2>
//               No hotels found
//               {destination ? ` for ${destination}` : ""}
//             </h2>

//             <p>Try another destination.</p>
//           </div>
//         )}
//       </main>
//     </>
//   );
// };

// export default SearchResults;
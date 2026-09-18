
import { useEffect } from "react";
import "./App.css";
import {
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import { Navbar } from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import { Alert } from "./components/Alert";
import { SearchModal } from "./components/SearchModal/SearchModal";

import Home from "./pages/Home/Home";
import SearchResults from "./pages/SearchResults/SearchResults";
import HotelDetails from "./pages/HotelDetails/HotelDetails";
import Wishlist from "./pages/Wishlist/Wishlist";
import OrderSummary from "./pages/OrderSummary/OrderSummary";
import Payment from "./pages/Payment/Payment";
import BookingSuccess from "./pages/BookingSuccess/BookingSuccess";


/* =========================================
   SCROLL TO TOP WHEN PAGE CHANGES
========================================= */

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};


/* =========================================
   APP
========================================= */

function App() {
  return (
    <>
      <ScrollToTop />

      <Navbar />

      <SearchModal />

      <Alert />

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/search"
          element={<SearchResults />}
        />

        <Route
          path="/hotels/:name/:location/:id/reserve"
          element={<HotelDetails />}
        />

        <Route
          path="/wishlist"
          element={<Wishlist />}
        />

        <Route
          path="/order-summary"
          element={<OrderSummary />}
        />

        <Route
          path="/payment"
          element={<Payment />}
        />

        <Route
          path="/booking-success"
          element={<BookingSuccess />}
        />

      </Routes>

      <Footer />
    </>
  );
}

export default App;
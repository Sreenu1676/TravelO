
import { useContext } from "react";
import { CategoryContext } from "../../context/category-context";
import "./Categories.css";

export const Categories = ({ onFilterClick }) => {
  const { hotelCategory, setHotelCategory } =
    useContext(CategoryContext);

  const categories = [
    "All Hotels",
    "National Parks",
    "Tiny Homes",
    "Farms",
    "Golfing",
    "Island",
    "Campervans",
    "Cabins",
    "Design",
    "Amazing Pools",
    "Lakefront",
  ];

  return (
    <div className="categories-container">

      <div className="categories-list">

        {categories.map((item) => {
          const isAllHotels = item === "All Hotels";

          const isActive = isAllHotels
            ? hotelCategory === ""
            : hotelCategory === item;

          return (
            <button
              key={item}
              type="button"
              className={`category-item ${
                isActive ? "active-category" : ""
              }`}
              onClick={() =>
                setHotelCategory(
                  isAllHotels ? "" : item
                )
              }
            >
              {item}
            </button>
          );
        })}

      </div>

      <div className="category-actions">

        <button
          type="button"
          className="filter-button"
          onClick={onFilterClick}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M4 5H20L14 12V18L10 20V12L4 5Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span>Filter</span>
        </button>

      </div>

    </div>
  );
};
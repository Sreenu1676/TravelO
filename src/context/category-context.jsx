import { createContext, useContext, useState } from "react";

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [hotelCategory, setHotelCategory] = useState("");

  return (
    <CategoryContext.Provider
      value={{
        hotelCategory,
        setHotelCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => {
  return useContext(CategoryContext);
};

export { CategoryContext };
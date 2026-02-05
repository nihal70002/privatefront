import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  // ➕ when a NEW variant is added
  const incrementCart = () => {
    setCartCount(prev => prev + 1);
  };

  // ➖ when a variant is REMOVED
  const decrementCart = () => {
    setCartCount(prev => Math.max(prev - 1, 0));
  };

  // 🔄 set count from backend (distinct items)
  const setCartFromApi = (count) => {
    setCartCount(count);
  };

  return (
    <CartContext.Provider
      value={{
        cartCount,
        incrementCart,
        decrementCart,
        setCartFromApi
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

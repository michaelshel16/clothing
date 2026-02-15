import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  userCart: [],
  product: null,        // single product (e.g., for detail page)
  mensWear: [],
  womensWear: [],
  tShirts: [],          // camelCase for consistency
  pants: [],
};

const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {
    setMensWear: (state, action) => {
      state.mensWear = action.payload; // assuming payload is the array directly
    },
    setWomensWear: (state, action) => {
      state.womensWear = action.payload;
    },
    setTShirts: (state, action) => {
      state.tShirts = action.payload;
    },
    setPants: (state, action) => {
      state.pants = action.payload;
    },
    setProduct: (state, action) => {
      state.product = action.payload;
    },

    // Auth actions
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      // Optional: if you get cart from backend on login
      // state.userCart = action.payload.userCart || [];
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.userCart = [];
      // Optionally reset other user-specific data
    },

    // Basic cart actions (add these as needed)
    addToCart: (state, action) => {
      state.userCart.push(action.payload);
    },
    removeFromCart: (state, action) => {
      state.userCart = state.userCart.filter(item => item.id !== action.payload.id);
    },
    clearCart: (state) => {
      state.userCart = [];
    },
    // Optional: update quantity
    updateCartItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.userCart.find(item => item.id === id);
      if (item) {
        item.quantity = quantity;
      }
    },
  },
});

export const {
  setMensWear,
  setWomensWear,
  setTShirts,
  setPants,
  setProduct,
  setLogin,
  setLogout,
  addToCart,
  removeFromCart,
  clearCart,
  updateCartItemQuantity,
} = itemSlice.actions;

export default itemSlice.reducer;
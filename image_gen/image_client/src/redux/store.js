// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import imageReducer from "../features/images/imageSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    images: imageReducer,
  },
});

export default store;

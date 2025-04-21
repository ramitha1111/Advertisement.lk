import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './themeSlice';
import authReducer from './authSlice';
import userReducer from './userSlice';
import advertisementReducer from './advertisementSlice';
const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    user: userReducer,
    advertisement: advertisementReducer
  },
});

export default store;

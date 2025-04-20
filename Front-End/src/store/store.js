import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './themeSlice';
import authReducer from './authSlice';
import userDashboardReducer from './userDashboardSlice';
import userReducer from './userSlice';
import advertisementReducer from './advertisementSlice';
const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    userDashboard: userDashboardReducer,
    user: userReducer,
    advertisement: advertisementReducer
  },
});

export default store;

import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './themeSlice';
import authReducer from './authSlice';
import userDashboardReducer from './userDashboardSlice';

const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    userDashboard: userDashboardReducer,
  },
});

export default store;

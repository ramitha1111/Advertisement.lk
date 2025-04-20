import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  advertisementData: JSON.parse(localStorage.getItem('advertisementData')) || null,
};

const advertisementSlice = createSlice({
  name: 'advertisement',
  initialState,
  reducers: {
    fetchAdvertisement: (state, action) => {
      state.advertisementData = action.payload.advertisementData || [];
      localStorage.setItem("advertisementData", JSON.stringify(state.advertisementData));
    },
    clearAdvertisement: (state) => {
      state.advertisementData = [];
      localStorage.removeItem("advertisementData");

    },
  },
});

export const { fetchAdvertisement, clearAdvertisement } = advertisementSlice.actions;

export default advertisementSlice.reducer;
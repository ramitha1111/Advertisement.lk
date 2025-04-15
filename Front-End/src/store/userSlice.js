import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userData: JSON.parse(localStorage.getItem('userData')) || null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    fetchUser: (state, action) => {
      state.userData = action.payload.userData;
      localStorage.setItem('userData', JSON.stringify(action.payload.userData));
    },
    crearUser: (state) => {
      state.userData = null;
      localStorage.removeItem('userData');
    },
  },
});

export const { fetchUser, crearUser } = userSlice.actions;

export default userSlice.reducer;

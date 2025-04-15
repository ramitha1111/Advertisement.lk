import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  activeTab: 'add-new-ad', // Default tab
  loading: false,
  error: null
}

export const userDashboardSlice = createSlice({
  name: 'userDashboard',
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    resetUserDashboard: () => initialState
  },
})

// Export actions
export const { setActiveTab, setLoading, setError, resetUserDashboard } = userDashboardSlice.actions

// Export selectors
export const selectActiveTab = (state) => state.userDashboard.activeTab
export const selectLoading = (state) => state.userDashboard.loading
export const selectError = (state) => state.userDashboard.error

// Async thunk for loading specific tab data
export const loadTabData = (tabName) => async (dispatch) => {
  try {
    dispatch(setLoading(true))
    dispatch(setActiveTab(tabName))
    
    // Here you would fetch data specific to the selected tab
    // const response = await api.fetchTabData(tabName)
    // Process response data
    
    dispatch(setLoading(false))
  } catch (error) {
    dispatch(setError(error.message))
    dispatch(setLoading(false))
  }
}

export default userDashboardSlice.reducer
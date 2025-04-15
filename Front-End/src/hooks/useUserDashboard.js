import { useSelector, useDispatch } from 'react-redux'
import { 
  setActiveTab, 
  loadTabData, 
  resetUserDashboard,
  selectActiveTab,
  selectLoading,
  selectError
} from '../store/userDashboardSlice'

const useUserDashboard = () => {
  const dispatch = useDispatch()
  
  const activeTab = useSelector(selectActiveTab)
  const loading = useSelector(selectLoading)
  const error = useSelector(selectError)
  
  const switchTab = (tabName) => {
    dispatch(setActiveTab(tabName))
  }
  
  const loadTab = (tabName) => {
    dispatch(loadTabData(tabName))
  }
  
  const reset = () => {
    dispatch(resetUserDashboard())
  }
  
  return {
    // State
    activeTab,
    loading,
    error,
    
    // Actions
    switchTab,
    loadTab,
    reset
  }
}

export default useUserDashboard
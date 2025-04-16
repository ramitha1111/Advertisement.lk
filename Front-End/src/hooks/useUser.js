import { useSelector } from 'react-redux';

const useUser = () => {
  const userData = useSelector((state) => state.user.userData);
  
  const fetchUser = (data) => ({
    type: 'user/fetchUser',
    payload: { userData: data }
  });
  
  const clearUser = () => ({
    type: 'user/clearUser'
  });

  return { userData, fetchUser, clearUser };
};

export default useUser;
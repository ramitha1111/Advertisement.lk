import { useSelector } from 'react-redux';

const useAuth = () => {
  const { token, user } = useSelector((state) => state.auth);
  const isLoggedIn = !!token;
  const isAdmin = user?.role === 'admin';

  return { isLoggedIn, isAdmin, user, token };
};

export default useAuth;

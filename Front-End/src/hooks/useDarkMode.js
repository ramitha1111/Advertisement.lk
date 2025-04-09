import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../store/themeSlice';

const useDarkMode = () => {
  const dispatch = useDispatch();
  const isDark = useSelector((state) => state.theme.isDark);

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDark]);

  return { isDark, toggleTheme: () => dispatch(toggleTheme()) };
};

export default useDarkMode;

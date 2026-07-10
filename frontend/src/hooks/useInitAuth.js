import { useEffect, useState } from 'react';
import { getCurrentUser } from '../api/authApi';
import useAuthStore from '../store/authStore';

function useInitAuth() {
  const [loading, setLoading] = useState(true);
  const { token, user, setUser, logout } = useAuthStore();

  useEffect(() => {
    async function init() {
      if (token && !user) {
        try {
          const response = await getCurrentUser();
          setUser(response.data);
        } catch (err) {
          logout();
        }
      }
      setLoading(false);
    }
    init();
  }, [token, user, setUser, logout]);

  return loading;
}

export default useInitAuth;
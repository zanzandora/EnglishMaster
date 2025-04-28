import { useState, ReactNode, useEffect } from 'react';
import { parse } from 'cookie';
import { AuthContext } from './AuthContext';
import { useIsClientMounted } from 'hooks/useIsClientMounted';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const isMounted = useIsClientMounted();

  //* Lấy token từ cookie khi component được load (reload trang)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (document.cookie) {
        try {
          // Parse cookies
          const cookies = parse(document.cookie);

          if (cookies.token) {
            setToken(cookies.token);
          } else {
            setToken(null);
          }
        } catch (error) {
          console.error('Error parsing cookies:', error); // Xử lý lỗi parse
        }
      } else {
        setToken(null); // Không có cookie, set token = null
      }
    }
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

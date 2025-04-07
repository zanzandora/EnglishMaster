import { useState, ReactNode, useEffect } from 'react';
import { parse } from 'cookie';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  //* Lấy token từ cookie khi component được load (reload trang)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // console.log('Cookies:', document.cookie); // In ra cookies để kiểm tra

      if (document.cookie) {
        try {
          // Parse cookies
          const cookies = parse(document.cookie);
          // console.log('Parsed Cookies:', cookies); // Debugging: kiểm tra cookies đã được parse đúng

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

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

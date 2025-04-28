import { useState, useEffect } from 'react';

/**
 * Hook kiểm tra component đã mounted trên Client hay chưa.
 *
 * - Tránh mismatch giữa Server và Client.
 * - Dùng để kiểm soát render những thứ chỉ có ở trình duyệt (window, navigator,...)
 */
export const useIsClientMounted = (): boolean => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
};

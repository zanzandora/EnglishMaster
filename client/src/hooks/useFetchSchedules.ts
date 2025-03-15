import { useState, useEffect } from 'react';

const useFetchSchedules = (reloadTrigger?: number) => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetch('/schedule/list');
        if (!response.ok) throw new Error('Lỗi khi tải dữ liệu');

        const data = await response.json();

        setSchedules(data); // Cập nhật state với dữ liệu đã xử lý
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [reloadTrigger]);

  return { schedules, loading, error };
};

export default useFetchSchedules;
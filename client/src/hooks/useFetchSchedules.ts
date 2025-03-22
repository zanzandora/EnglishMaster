import { useState, useEffect } from 'react';

const useFetchSchedules = (reloadTrigger?: number, role?: string) => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const endpoint =
          role === 'teacher' ? '/schedule/by-teacher' : '/schedule/list';
        const response = await fetch(endpoint);
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
  }, [reloadTrigger,role]);

  return { schedules, loading, error };
};

export default useFetchSchedules;

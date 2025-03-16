import { useState, useEffect } from 'react';

const useFetchAttendances = (reloadTrigger?: number) => {
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttendances = async () => {
      try {
        const response = await fetch('/attendance/list');
        if (!response.ok) throw new Error('Lỗi khi tải dữ liệu');

        const data = await response.json();

        setAttendances(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendances();
  }, [reloadTrigger]);

  return { attendances, loading, error };
};

export default useFetchAttendances;

import { useState, useEffect } from 'react';
import { Teacher } from '@interfaces';

const useFetchTeachers = (reloadTrigger?: number) => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch('/teacher/list');
        if (!response.ok) throw new Error('Lỗi khi tải dữ liệu');

        const data = await response.json();

        setTeachers(data); // Cập nhật state với dữ liệu đã xử lý
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, [reloadTrigger]);

  return { teachers, loading, error };
};

export default useFetchTeachers;
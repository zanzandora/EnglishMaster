import { useState, useEffect } from 'react';

const useFetchcourses = (reloadTrigger?: number) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchcourses = async () => {
      try {
        const response = await fetch('/course/list');
        if (!response.ok) throw new Error('Lỗi khi tải dữ liệu');

        const data = await response.json();

        setCourses(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchcourses();
  }, [reloadTrigger]);

  return { courses, loading, error };
};

export default useFetchcourses;

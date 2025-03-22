import { formatDate } from '@utils/dateUtils';
import { useState, useEffect } from 'react';

const useFetchStudents = (reloadTrigger?: number,role?: string) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchstudents = async () => {
      try {
        const endpoint = role === 'teacher' 
        ? '/student/by-teacher'  
        : '/student/list';  
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error('Lỗi khi tải dữ liệu');

        const data = await response.json();

        setStudents(
          data.map((c: any) => ({
            ...c,
            dateOfBirth: formatDate(c.dateOfBirth, 'yyyy-MM-dd'),
          }))
        ); // Cập nhật state với dữ liệu đã xử lý
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchstudents();
  }, [reloadTrigger,role]);

  return { students, loading, error };
};

// const useFetchUnregisteredStudents = (reloadTrigger?: number) => {
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchstudents = async () => {
//       try {
//         const response = await fetch('/student/unassigned-students');
//         if (!response.ok) throw new Error('Lỗi khi tải dữ liệu');

//         const data = await response.json();

//         setStudents(
//          data)
//       } catch (error: any) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchstudents();
//   }, [reloadTrigger]);

//   return { students, loading, error };
// };

export default useFetchStudents;

// export { useFetchUnregisteredStudents };


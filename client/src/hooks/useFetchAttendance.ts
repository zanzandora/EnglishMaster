import { useState, useEffect } from 'react';
import { Attendance } from "@interfaces";

const useFetchAttendances = (role: string, reloadTrigger?: number) => {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const prevTeacherID = useRef(teacherID); 
  
  useEffect(() => {
   
    const fetchAttendances = async () => {
      // if (teacherID === prevTeacherID.current && !reloadTrigger) return; 
    
      try {
        setLoading(true);
       
        const response = await fetch(role === 'admin' ? '/attendance/list' : `/attendance/list-today`);
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
    // prevTeacherID.current = teacherID;
  }, [reloadTrigger,role]);

  return { attendances, loading, error };
};

export default useFetchAttendances;

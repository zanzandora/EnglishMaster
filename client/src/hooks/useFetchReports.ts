import { useState, useEffect } from 'react';
import {Report} from '@interfaces';

const useFetchreports = (reloadTrigger?: number, options?:string, classID?: any) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchreports = async () => {
      try {
        let url = `/report/list?options=${options}`;
        if(classID !== '') url += `&classID=${classID}`
        const response = await fetch(url);
        if (!response.ok) throw new Error('Lỗi khi tải dữ liệu');

        const data = await response.json();

        setReports(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchreports();
  }, [reloadTrigger,options,classID]);

  return { reports, loading, error };
};

export default useFetchreports;

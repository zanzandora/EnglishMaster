import { formatDate } from '@utils/dateUtils';
import { useState, useEffect } from 'react';

const useFetchClasses = (reloadTrigger?: number, userID?: number) => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const url = userID ? `/class/${userID}` : '/class/list'; 
                const response = await fetch(url);
                if (!response.ok) throw new Error('Lỗi khi tải dữ liệu');
                const data = await response.json();
                console.log(data); 

                setClasses(
                    data.map((c: any) => ({
                        ...c,
                        startDate: formatDate(c.startDate, 'yyyy/MM/dd'),
                        endDate: formatDate(c.endDate, 'yyyy/MM/dd'),
                    }))
                );
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchClasses();
    }, [reloadTrigger,userID]);

    return { classes, loading, error };
};

export default useFetchClasses;
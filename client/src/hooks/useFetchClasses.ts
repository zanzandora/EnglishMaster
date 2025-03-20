import { formatDate } from '@utils/dateUtils';
import { useState, useEffect } from 'react';

const useFetchClasses = (reloadTrigger?: number) => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await fetch('/class/list');
                if (!response.ok) throw new Error('Lỗi khi tải dữ liệu');

                const data = await response.json();

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
    }, [reloadTrigger]);

    return { classes, loading, error };
};

export default useFetchClasses;
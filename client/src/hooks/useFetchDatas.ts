import { useState, useEffect, useRef } from 'react';
import {
  GenderData,
  ApiGenderResponse,
  MonthlyGrowthData,
  ApiGrowthResponse,
} from '@interfaces';

export const useFetchCountGenders = () => {
  const [data, setData] = useState<GenderData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController>();

  useEffect(() => {
    const fetchCountGenders = async () => {
      abortControllerRef.current = new AbortController();

      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/analytics/countGender', {
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const apiData: ApiGenderResponse = await response.json();

        // Format data với fill color
        const formattedData: GenderData[] = [
          {
            name: 'Total',
            count: apiData.total,
            fill: 'white',
          },
          {
            name: 'Girls',
            count:
              apiData.genders.find((g) => g.gender === 'female')?.count || 0,
            fill: 'mediumvioletred',
          },
          {
            name: 'Boys',
            count: apiData.genders.find((g) => g.gender === 'male')?.count || 0,
            fill: 'dodgerblue',
          },
        ];

        setData(formattedData);
      } catch (err) {
        if (!abortControllerRef.current.signal.aborted) {
          setError(
            err instanceof Error ? err.message : 'Unknown error occurred'
          );
        }
      } finally {
        if (!abortControllerRef.current.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchCountGenders();

    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return {
    data,
    loading,
    error,
  };
};

export const useMonthlyGrowth = () => {
  const [data, setData] = useState<MonthlyGrowthData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/analytics/monthly-growth');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const apiData: ApiGrowthResponse[] = await response.json();

        // Format data
        const formattedData = apiData.data
          .sort((a: any, b: any) => a.month - b.month) // Đảm bảo thứ tự tháng
          .map((item: any) => ({
            name: new Date(2025, item.month - 1).toLocaleString('en-US', { month: 'short' }),
            growth: item.count,
          }));
          console.log(formattedData);

        setData(formattedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

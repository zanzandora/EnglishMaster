// hooks/useGlobalSearch.ts
import { useState, useEffect } from 'react';
import { debounce } from 'lodash';
interface SearchResult {
  students: any[];
  teachers: any[];
  classes: any[];
  courses: any[];
}

const useGlobalSearch = () => {
  const [results, setResults] = useState<SearchResult>({ students: [], teachers: [], classes: [], courses: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = debounce(async (query: string) => {
    if (!query.trim()) {
      setResults({ students: [], teachers: [], classes: [], courses: [] });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/search/global?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      console.log(data);
      
      setResults(data.results);
    } catch (err) {
      setError(err.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  }, 300);

  useEffect(() => {
    return () => search.cancel();
  }, []);

  return { results, loading, error, search };
};

export default useGlobalSearch;
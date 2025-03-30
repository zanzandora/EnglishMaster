import { useEffect, useState } from 'react';
import useGlobalSearch from 'hooks/useGlobalSearch';
import SearchResults from './SearchResults';
import useOutsideClick from 'hooks/useOutsideClick';

const TableSearchGlobal = () => {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const wrapperRef = useOutsideClick(() => setShowResults(false));
  const { results, loading, error, search, searchQuery } = useGlobalSearch();

  // Hàm chuẩn hóa chuỗi (loại bỏ khoảng trắng dư thừa)
  const normalizeSearchString = (str: string): string => {
    return str.trim().replace(/\s+/g, ' '); // Loại bỏ khoảng trắng thừa
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    search(normalizeSearchString(value));
    setShowResults(!!value.trim());
  };

  // Thêm phím tắt Esc để đóng
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowResults(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div ref={wrapperRef} className='relative w-full max-w-2xl mx-auto'>
      <div className='w-full  md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2'>
        <img src='/search.png' alt='' width={14} height={14} />
        <input
          type='text'
          placeholder='Search students, teachers, classes...'
          className='w-full p-2 bg-transparent outline-none'
          value={query}
          onChange={handleSearch}
          onClick={() => setShowResults(!!query.trim())}
        />
        {loading && <span className='ml-2 animate-spin'>🌀</span>}
      </div>

      {error && <div className='text-red-500 mt-2'>{error}</div>}

      {query && !loading && showResults && (
        <SearchResults
          results={results}
          searchQuery={searchQuery}
          className='absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl z-50'
        />
      )}
    </div>
  );
};

export default TableSearchGlobal;

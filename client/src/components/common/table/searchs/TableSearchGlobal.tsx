import { useState } from 'react';
import useGlobalSearch from 'hooks/useGlobalSearch';
import SearchResults from './SearchResults';

const TableSearchGlobal = () => {
  const [query, setQuery] = useState('');
  const { results, loading, error, search } = useGlobalSearch();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    search(value);
  };

  return (
    <div className='relative w-full max-w-2xl mx-auto'>
      <div className='w-full  md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2'>
        <img src='/search.png' alt='' width={14} height={14} />
        <input
          type='text'
          placeholder='Search students, teachers, classes...'
          className='w-full p-2 bg-transparent outline-none'
          value={query}
          onChange={handleSearch}
        />
        {loading && <span className='ml-2 animate-spin'>🌀</span>}
      </div>

      {error && <div className='text-red-500 mt-2'>{error}</div>}

      {query && !loading && (
        <SearchResults
          results={results}
          className='absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl z-50'
        />
      )}
    </div>

    // <div className='w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2'>
    //   <img src='/search.png' alt='' width={14} height={14} />
    //   <input
    //     type='text'
    //     placeholder='Search...'
    //     className='w-[200px] p-2 bg-transparent outline-none'
    //   />
    // </div>
  );
};

export default TableSearchGlobal;

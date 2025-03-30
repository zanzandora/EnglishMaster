import { useState, useCallback, useEffect, useRef } from 'react';
import { debounce } from 'lodash';

interface TableSearchProps {
  searchType:
    | 'student'
    | 'teacher'
    | 'course'
    | 'class'
    | 'lesson'
    | 'exam'
    | 'result'
    | 'anouncement';
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceTime?: number;
}

const TableSearch = ({
  searchType,
  onSearch,
  placeholder = 'Search',
  debounceTime = 300,
}: TableSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchRef = useRef(debounce(() => {}, debounceTime));

  // Cập nhật debounce function khi props thay đổi
  useEffect(() => {
    debouncedSearchRef.current = debounce((query: string) => {
      onSearch(query);
    }, debounceTime);
  }, [onSearch, debounceTime]);

  // Hủy debounce khi unmount
  useEffect(() => {
    return () => {
      debouncedSearchRef.current.cancel();
    };
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    debouncedSearchRef.current(value);
  };

  const getCustomPlaceholder = useCallback(() => {
    const baseText = placeholder || 'Search';
    switch (searchType) {
      case 'student':
        return `${baseText} students...`;
      case 'teacher':
        return `${baseText} teachers...`;
      case 'course':
        return `${baseText} courses...`;
      case 'class':
        return `${baseText} classes...`;
      case 'lesson':
        return `${baseText} lessons...`;
      case 'exam':
        return `${baseText} exams...`;
      case 'result':
        return `${baseText} results...`;
      case 'anouncement':
        return `${baseText} announcements...`;
      default:
        return placeholder;
    }
  }, [searchType, placeholder]);

  const clearSearch = () => {
    setSearchQuery('');
    onSearch(''); // Gọi search ngay lập tức với chuỗi rỗng
    debouncedSearchRef.current.cancel(); // Hủy các lần gọi đang chờ
  };

  return (
    <div className='w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2'>
      <img
        src='/search.png'
        alt='Search icon'
        width={14}
        height={14}
        className='opacity-60'
      />
      <input
        type='text'
        placeholder={getCustomPlaceholder()}
        value={searchQuery}
        onChange={(e) => handleSearchChange(e.target.value)}
        className='w-[200px] p-2 bg-transparent outline-none placeholder:text-gray-400'
      />
      {searchQuery && (
        <button
          onClick={clearSearch}
          className='p-1 hover:bg-gray-100 rounded-full transition-colors'
          aria-label='Clear search'
        >
          X
        </button>
      )}
    </div>
  );
};

export default TableSearch;

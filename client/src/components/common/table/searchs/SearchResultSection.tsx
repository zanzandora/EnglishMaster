import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface SearchResultSectionProps {
  title: string;
  items: any[];
  renderItem: (item: any) => React.ReactNode;
  maxItems?: number;
  className?: string;
}

const SearchResultSection = ({
  title,
  items,
  renderItem,
  maxItems = 5,
  className = '',
}: SearchResultSectionProps) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const visibleItems = expanded ? items : items.slice(0, maxItems);

  return (
    <div className={`mb-6 ${className}`}>
      <h3 className='text-lg font-semibold mb-3 flex items-center'>
        {title}
        <span className='ml-2 text-sm text-gray-500'>
          ({items.length} {t('search.results')})
        </span>
      </h3>

      <ul className='space-y-2'>
        {visibleItems.map((item, index) => (
          <li
            key={item.id || index}
            className='p-3 hover:bg-gray-50 rounded-lg transition-colors'
          >
            {renderItem(item)}
          </li>
        ))}
      </ul>

      {items.length > maxItems && (
        <button
          onClick={() => setExpanded(!expanded)}
          className='mt-2 text-sm text-blue-600 hover:text-blue-800'
        >
          {expanded
            ? t('search.showLess')
            : t('search.showMore', { count: items.length - maxItems })}
        </button>
      )}
    </div>
  );
};

export default SearchResultSection;

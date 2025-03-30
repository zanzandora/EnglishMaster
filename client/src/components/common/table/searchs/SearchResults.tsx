import { useTranslation } from 'react-i18next';
import SearchResultSection from './SearchResultSection';
import { useAuth } from 'hooks/useAuth';
import { decodeToken } from '@utils/decodeToken ';
import { highlightText } from '@utils/highlight';
import React from 'react';
import { Link } from 'react-router-dom';

const SearchResults = ({ results, searchQuery, className = '' }) => {
  const { t } = useTranslation();
  const { token } = useAuth();
  const decodedToken = decodeToken(token);
  const role = decodedToken?.role;

  // Render item với highlight
  const renderHighlightedItem = (text: string) => {
    return (
      <span>
        {highlightText(text, searchQuery).map((part, index) => (
          <React.Fragment key={index}>{part}</React.Fragment>
        ))}
      </span>
    );
  };

  return (
    <div className={`p-4 max-h-[70vh] overflow-y-auto ${className}`}>
      {results.students.length > 0 && (
        <SearchResultSection
          title={t('search.students')}
          items={results.students}
          renderItem={(student) => (
            <>
              <Link to={`/${role}/list/students/${student.id}`}>
                <div className='flex items-center gap-3'>
                  <div className='w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center'>
                    <span className='text-blue-600 text-sm'>S</span>
                  </div>
                  <div>
                    <h4 className='font-medium'>
                      {renderHighlightedItem(student.name)}
                    </h4>
                    <p className='text-sm text-gray-500'>
                      {renderHighlightedItem(student.email)}
                    </p>
                  </div>
                </div>
              </Link>
            </>
          )}
        />
      )}

      {role === 'admin' && results.teachers?.length > 0 && (
        <SearchResultSection
          title={t('search.teachers')}
          items={results.teachers}
          renderItem={(teacher) => (
            <>
              <Link to={`/${role}/list/teachers/${teacher.teacher.userID}`}>
                <div className='flex items-center gap-3'>
                  <div className='w-8 h-8 rounded-full bg-green-100 flex items-center justify-center'>
                    <span className='text-green-600 text-sm'>T</span>
                  </div>
                  <div>
                    <h4 className='font-medium'>
                      {renderHighlightedItem(teacher.user.name)}
                    </h4>
                    <p className='text-sm text-gray-500'>
                      {renderHighlightedItem(teacher.user.email)}
                    </p>
                  </div>
                </div>
              </Link>
            </>
          )}
        />
      )}

      {results.classes.length > 0 && (
        <SearchResultSection
          title={t('search.classes')}
          items={results.classes}
          renderItem={(classItem) => (
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center'>
                <span className='text-purple-600 text-sm'>C</span>
              </div>
              <div>
                <h4 className='font-medium'>
                  {renderHighlightedItem(classItem.name)}
                </h4>
                <p className='text-sm text-gray-500'>
                  {classItem.startDate} - {classItem.endDate}
                </p>
              </div>
            </div>
          )}
        />
      )}

      {results.courses?.length > 0 && role === 'admin' && (
        <SearchResultSection
          title={t('search.courses')}
          items={results.courses}
          renderItem={(course) => (
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center'>
                <span className='text-orange-600 text-sm'>CR</span>
              </div>
              <div>
                <h4 className='font-medium'>
                  {renderHighlightedItem(course.name)}
                </h4>
                <p className='text-sm text-gray-500'>
                  {course.duration} months
                </p>
              </div>
            </div>
          )}
        />
      )}

      {Object.values(results).every((arr) => arr.length === 0) && (
        <div className='text-center py-8 text-gray-500'>
          {t('search.noResults')}
        </div>
      )}
    </div>
  );
};

export default SearchResults;

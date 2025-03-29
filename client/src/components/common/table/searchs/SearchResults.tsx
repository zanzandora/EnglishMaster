import { useTranslation } from 'react-i18next';
import SearchResultSection from './SearchResultSection';
import { useAuth } from 'hooks/useAuth';
import { decodeToken } from '@utils/decodeToken ';

const SearchResults = ({ results, className = '' }) => {
  const { t } = useTranslation();
  const { token } = useAuth();
  const decodedToken = decodeToken(token);
  const role = decodedToken?.role;

  return (
    <div className={`p-4 max-h-[70vh] overflow-y-auto ${className}`}>
      {results.students.length > 0 && (
        <SearchResultSection
          title={t('search.students')}
          items={results.students}
          renderItem={(student) => (
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center'>
                <span className='text-blue-600 text-sm'>S</span>
              </div>
              <div>
                <h4 className='font-medium'>{student.name}</h4>
                <p className='text-sm text-gray-500'>{student.email}</p>
              </div>
            </div>
          )}
        />
      )}

      {role === 'admin' && results.teachers?.length > 0 && (
        <SearchResultSection
          title={t('search.teachers')}
          items={results.teachers}
          renderItem={(teacher) => (
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 rounded-full bg-green-100 flex items-center justify-center'>
                <span className='text-green-600 text-sm'>T</span>
              </div>
              <div>
                <h4 className='font-medium'>{teacher.user.name}</h4>
                <p className='text-sm text-gray-500'>
                  {teacher.teacher.specialization}
                </p>
              </div>
            </div>
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
                <h4 className='font-medium'>{classItem.name}</h4>
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
                <h4 className='font-medium'>{course.name}</h4>
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

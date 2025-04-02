import { useEffect, useState } from 'react';
import Table from '@components/common/table/Table';
import usePagination from 'hooks/usePagination';
import Pagination from '@components/common/Pagination';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const StudentsList = ({ classID }) => {
  const { t } = useTranslation();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { currentData, currentPage, totalPages, setCurrentPage } =
    usePagination(students, 5);

  useEffect(() => {
    const fetchStudents = async () => {
      if (classID) {
        setLoading(true);
        try {
          const res = await fetch(`/student/students/${classID}`);
          if (!res.ok) {
            throw new Error(`Error: ${res.status} ${res.statusText}`);
          }
          const data = await res.json();
          setStudents(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchStudents();
  }, [classID]);

  const columns = [
    { header: t('form.class.list.studentId'), accessor: 'studentID' },
    { header: t('form.class.list.studentName'), accessor: 'studentName' },
    { header: t('form.class.list.email'), accessor: 'email' },
    { header: t('form.class.list.actions'), accessor: 'action' },
  ];

  const renderRow = (item: any) => (
    <tr
      key={item.studentID}
      className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-secondary-lavenderFade'
    >
      <td className='flex items-center gap-4 p-4'>{item.studentID}</td>
      <td className=''>{item.studentName}</td>
      <td className=''>{item.email}</td>
      <td className=''>
        <Link to={`/admin/list/students/${item.studentID}`}>
          <button className='w-7 h-7 flex items-center justify-center rounded-full bg-tables-actions-bgViewIcon'>
            <img
              src='/view.png'
              alt=''
              width={16}
              height={16}
              className='w-8/12'
            />
          </button>
        </Link>
      </td>
    </tr>
  );

  return (
    <div>
      <h2 className='text-lg font-semibold mb-4'>
        {t('form.class.list.title')}
      </h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className='error'>{error}</p>
      ) : students.length > 0 ? (
        <Table columns={columns} renderRow={renderRow} data={currentData} />
      ) : (
        <p>No students found.</p>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default StudentsList;

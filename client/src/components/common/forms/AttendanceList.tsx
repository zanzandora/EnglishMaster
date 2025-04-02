import { useEffect, useState } from 'react';
import Table from '@components/common/table/Table';
import usePagination from 'hooks/usePagination';
import Pagination from '@components/common/Pagination';
import { useTranslation } from 'react-i18next';

const AttendancesList = ({ studentID }) => {
  const { t } = useTranslation();
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { currentData, currentPage, totalPages, setCurrentPage } =
    usePagination(attendances, 5);

  useEffect(() => {
    const fetchAttendances = async () => {
      if (studentID) {
        setLoading(true);
        try {
          const res = await fetch(`/attendance/${studentID}`);
          if (!res.ok) {
            throw new Error(`Error: ${res.status} ${res.statusText}`);
          }
          const data = await res.json();

          // Filter out duplicate entries with status NULL and same checkInTime date
          const uniqueAttendances = data.filter(
            (item, index, self) =>
              item.status !== null ||
              index ===
                self.findIndex(
                  (t) =>
                    t.checkInTime.split('T')[0] ===
                      item.checkInTime.split('T')[0] && t.status === null
                )
          );

          setAttendances(uniqueAttendances);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAttendances();
  }, [studentID]);

  const columns = [
    { header: t('form.attendance.list.date'), accessor: 'date' },
    { header: t('form.attendance.list.status'), accessor: 'status' },
    { header: t('form.attendance.list.note'), accessor: 'note' },
  ];

  const renderRow = (item: any) => (
    <tr
      key={item.id}
      className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-secondary-lavenderFade'
    >
      <td className='flex items-center gap-4 p-4'>{item.checkInTime}</td>
      <td className='p-4'>
        {item.status === null ? 'none' : item.status ? '✓' : '✗'}
      </td>
      <td className=''>{item.note || ''}</td>
    </tr>
  );

  return (
    <div>
      <h2 className='text-lg font-semibold mb-4'>
        {t('form.attendance.list.title')}
      </h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className='error'>{error}</p>
      ) : attendances.length > 0 &&
        attendances.some((att) => att.status !== null) ? (
        <Table columns={columns} renderRow={renderRow} data={currentData} />
      ) : (
        <p>No records found.</p>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default AttendancesList;

import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { useTranslation } from 'react-i18next';
import Table from '@components/common/table/Table';
import Pagination from '@components/common/Pagination';

type ReportData = {
  learning: { id: number; name: string; progress: string; score: string }[];
  teacher: { id: number; name: string; rating: string }[];
  course: {
    id: number;
    name: string;
    completion: string;
    students: number;
  }[];
  finance: { id: number; category: string; amount: string }[];
};

const data: ReportData = {
  learning: [
    { id: 1, name: 'Nguyễn Văn A', progress: '80%', score: '85/100' },
    { id: 2, name: 'Trần Thị B', progress: '60%', score: '70/100' },
    { id: 3, name: 'Trần Thị B', progress: '60%', score: '70/100' },
    { id: 4, name: 'Trần Thị B', progress: '60%', score: '70/100' },
    { id: 5, name: 'Trần Thị B', progress: '60%', score: '70/100' },
  ],
  teacher: [
    { id: 1, name: 'GV. Lê Văn C', rating: '4.8' },
    { id: 2, name: 'GV. Phạm Văn D', rating: '4.5 ' },
  ],
  course: [
    { id: 1, name: 'Tiếng Anh Cơ Bản', completion: '75%', students: 30 },
    { id: 2, name: 'Tiếng Anh Giao Tiếp', completion: '85%', students: 25 },
  ],
  finance: [
    { id: 1, category: 'Học phí', amount: '10,000,000 VND' },
    { id: 2, category: 'Chi phí vận hành', amount: '3,500,000 VND' },
  ],
};

const ReportPage = () => {
  const { t } = useTranslation();
  const [selectedReport, setSelectedReport] =
    useState<keyof ReportData>('learning');

  const columns = Object.keys(data[selectedReport][0] || {}).map((key) => ({
    header: t(`table.reports.${selectedReport}.${key}`),
    accessor: key,
    className: 'p-2 border-b',
  }));

  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 3);
    return date;
  });
  const [endDate, setEndDate] = useState(new Date());

  const reports = [
    { key: 'learning', label: 'Learning' },
    { key: 'teacher', label: 'Teacher' },
    { key: 'course', label: 'Course' },
    { key: 'finance', label: 'Finance' },
  ];

  const renderRow = (item: unknown) => {
    const reportItem = item as (typeof data)[typeof selectedReport][0];
    return (
      <tr
        key={reportItem.id}
        className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-secondary-lavenderFade'
      >
        {Object.keys(reportItem).map((key) => (
          <td key={key} className='p-4'>
            {reportItem[key as keyof typeof reportItem]}
          </td>
        ))}
      </tr>
    );
  };

  return (
    <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0'>
      {/* Thanh điều hướng báo cáo */}
      <div className='flex gap-4 mb-5'>
        {reports.map((report) => (
          <button
            key={report.key}
            className={`px-4 py-2 rounded flex grow text-center justify-center ${
              selectedReport === report.key
                ? 'bg-primary-redLight_fade font-bold text-orange-900 shadow-[0_1px_3px_rgba(0,0,0,0.5)] active:shadow-[0_0px_1px_rgba(0,0,0,0.5)] active:scale-[0.995]'
                : 'bg-calendar-toolBar-btn text-sky-800 font-bold hover:opacity-80 shadow-[0_1px_3px_rgba(0,0,0,0.5)] active:shadow-[0_0px_1px_rgba(0,0,0,0.5)] active:scale-[0.995]'
            }`}
            onClick={() => setSelectedReport(report.key as keyof ReportData)}
          >
            {t(`table.reports.${report.key}.label`)}
          </button>
        ))}
      </div>

      {/* Bộ lọc */}
      <div className='flex gap-4 mb-5'>
        <div className='hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2'>
          <img src='/search.png' alt='' width={14} height={14} />
          <input
            type='text'
            placeholder='Search...'
            className='w-[200px] p-2 bg-transparent outline-none'
          />
        </div>
        <DatePicker
          locale={t('calendar.locale')}
          selected={startDate}
          onChange={(date) => setStartDate(date || new Date())}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          className={`transition-width duration-300 ease-in-out px-4 py-2 border rounded-full border-primary `}
          portalId='root'
        />
        <DatePicker
          locale={t('calendar.locale')}
          selected={endDate}
          onChange={(date) => setEndDate(date || new Date())}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          className={`transition-width duration-300 ease-in-out px-4 py-2 border rounded-full border-primary `}
          portalId='root'
        />
      </div>

      {/* Bảng dữ liệu */}
      <Table
        columns={columns}
        data={data[selectedReport]}
        renderRow={renderRow}
      />
      {/* Phân trang */}
      <Pagination />
    </div>
  );
};

export default ReportPage;

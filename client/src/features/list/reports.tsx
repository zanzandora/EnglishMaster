import { useState } from 'react';

const ReportPage = () => {
  const [selectedReport, setSelectedReport] =
    useState<keyof ReportData>('learning');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  const reports = [
    { key: 'learning', label: 'Học tập' },
    { key: 'teacher', label: 'Giảng viên' },
    { key: 'course', label: 'Khóa học' },
    { key: 'finance', label: 'Tài chính' },
  ];

  type ReportData = {
    learning: { id: number; name: string; progress: string; score: string }[];
    teacher: { id: number; name: string; rating: string; sessions: number }[];
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
    ],
    teacher: [
      { id: 1, name: 'GV. Lê Văn C', rating: '4.8', sessions: 20 },
      { id: 2, name: 'GV. Phạm Văn D', rating: '4.5', sessions: 18 },
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

  return (
    <div className='p-5'>
      {/* Thanh điều hướng báo cáo */}
      <div className='flex gap-4 mb-5'>
        {reports.map((report) => (
          <button
            key={report.key}
            className={`px-4 py-2 border rounded ${
              selectedReport === report.key
                ? 'bg-blue-500 text-white'
                : 'bg-white text-black border-gray-300'
            }`}
            onClick={() => setSelectedReport(report.key as keyof ReportData)}
          >
            {report.label}
          </button>
        ))}
      </div>

      {/* Bộ lọc */}
      <div className='flex gap-4 mb-5'>
        <input
          type='text'
          placeholder='Tìm kiếm...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='px-3 py-2 border border-gray-300 rounded w-52'
        />
        <input
          type='date'
          value={dateRange.from}
          onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
          className='px-3 py-2 border border-gray-300 rounded'
        />
        <input
          type='date'
          value={dateRange.to}
          onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
          className='px-3 py-2 border border-gray-300 rounded'
        />
      </div>

      {/* Bảng dữ liệu */}
      <table className='w-full border-collapse border border-gray-300'>
        <thead>
          <tr className='bg-gray-100'>
            {Object.keys(data[selectedReport][0] || {}).map((key) => (
              <th key={key} className='border border-gray-300 p-2 text-left'>
                {key.toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data[selectedReport].map((item) => (
            <tr key={item.id} className='border border-gray-300'>
              {Object.values(item).map((val, idx) => (
                <td key={idx} className='border border-gray-300 p-2'>
                  {val}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportPage;

// useExportExcel.ts
import { formatDate } from '@utils/dateUtils';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';

export const useExporReport = () => {
  const studentColumns = [
    'NO',
    'Student Name',
    'Student ID',
    'Birth',
    'Class',
    'Midterm score (MT)',
    'Final score (FT)',
    'Total Score',
    'GPA',
    'Status',
    'Attended',
    'Absent',
  ];

  const courseColumns = [
    'NO',
    'Course Name',
    'Classes',
    'Teachers',
    'Total Students',
  ];

  const columnToFieldMappingStudent = {
    NO: 'NO',
    'Student Name': 'studentName',
    'Student ID': 'studentID',
    Birth: 'dateOfBirth',
    Class: 'Class',
    'Midterm score (MT)': 'MT',
    'Final score (FT)': 'FT',
    'Total Score': 'totalScore',
    GPA: 'GPA',
    Status: 'Status',
    Attended: 'Attended',
    Absent: 'Absent',
  };

  const columnToFieldMappingCourse = {
    NO: 'NO',
    'Course Name': 'courseName',
    Classes: 'classNames',
    Teachers: 'teacherNames',
    Students: 'totalStudents',
  };

  const mapDataToColumns = (
    data: any[],
    columnMapping: Record<string, string>
  ) => {
    return data.map((item) => {
      const mappedItem: Record<string, any> = {};
      for (const column in columnMapping) {
        mappedItem[column] = item[columnMapping[column]];
      }
      return mappedItem;
    });
  };

  const handleExport = (
    selectedReport: string,
    filteredReports: any[],
    getScoreGrade: (score: number) => string
  ) => {
    // Làm phẳng dữ liệu
    const flattenStudentData = filteredReports.map((item, index) => ({
      NO: index + 1,
      studentName: item.student?.studentName,
      studentID: item.student?.studentID,
      dateOfBirth: formatDate(item.student?.dateOfBirth, 'yyyy-MM-dd'),
      Class: item.class?.className,
      MT: item.score?.MT,
      FT: item.score?.FT,
      totalScore: item.score?.totalScore,
      GPA: getScoreGrade(item.score?.totalScore),
      Status: item.score?.status,
      Attended: item.attendance?.totalCheckins,
      Absent: item.attendance?.totalAbsences,
    }));

    const flattenCourseData = filteredReports.map((item, index) => ({
      NO: index + 1,
      courseName: item.course?.courseName,
      classNames: item.class?.classNames,
      teacherNames: item.class?.teacherNames,
      totalStudents: item.class?.totalStudents,
    }));

    // Xử lý dữ liệu
    const dataToExport =
      selectedReport === 'student'
        ? mapDataToColumns(flattenStudentData, columnToFieldMappingStudent)
        : mapDataToColumns(flattenCourseData, columnToFieldMappingCourse);

    const columnsToExport =
      selectedReport === 'student' ? studentColumns : courseColumns;

    if (dataToExport.length === 0) {
      toast.error('No data available to export!');
      return;
    }

    // Tạo file Excel
    const ws = XLSX.utils.json_to_sheet(dataToExport, {
      header: columnsToExport,
    });

    ws['!cols'] = columnsToExport.map(() => ({
      width: 5,
    }));

    // Xác định index của các cột cần loại trừ
    const includedColumns = [
      'Student Name',
      'Class',
      ' Birth',
      'Student ID',
      'Classes',
      'Teachers',
      'Total Students',
      'Course Name',
      'Final score (FT)',
      'Midterm score (MT)',
    ];
    const includedIndexes = includedColumns.map((col) =>
      columnsToExport.indexOf(col)
    );

    // Duyệt qua từng ô và điều chỉnh style cho các cột loại trừ
    const range = XLSX.utils.decode_range(ws['!ref'] ?? '');
    for (let R = range.s.r; R <= range.e.r; R++) {
      for (let C = range.s.c; C <= range.e.c; C++) {
        let cellAddress = XLSX.utils.encode_cell({ r: R, c: C });

        // Nếu là cột loại trừ, xóa style căn giữa và màu nền
        if (includedIndexes.includes(C)) {
          if (ws[cellAddress]) {
            ws['!cols'][C] = { width: 20 };
          }
        } else {
          // Nếu không phải là cột cần áp dụng style, xóa các style
          if (ws[cellAddress]) {
            delete ws[cellAddress].width;
          }
        }
      }
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    XLSX.writeFile(wb, 'report.xlsx');
  };

  return { handleExport };
};

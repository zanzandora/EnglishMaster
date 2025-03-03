import { format } from 'date-fns';

/**
 * Định dạng ngày thành YYYY-MM-DD
 */
export const formatDate = (date: Date | string, dateFormat = 'yyyy-MM-dd'): string => {
  if (!date) return 'N/A';
  
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  return format(parsedDate, dateFormat);
};

/**
 * Định dạng ngày theo locale (VD: dd/MM/yyyy, MM/dd/yyyy,...)
 */
export const formatDateLocale = (date: Date | string, locale = 'vi-VN'): string => {
  if (!date) return 'N/A';

  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  return parsedDate.toLocaleDateString(locale);
};

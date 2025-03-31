export const sortByField = <T,>(
  data: T[],
  field: string,
  order: 'asc' | 'desc' | null
): T[] => {
  if (!order || !data.length) return [...data];

  const getNestedValue = (obj: any, path: string) => 
    path.split('.').reduce((acc, key) => acc?.[key], obj);

  return [...data].sort((a, b) => {
    const aValue = getNestedValue(a, field);
    const bValue = getNestedValue(b, field);
    
    // Xử lý trường hợp giá trị null/undefined
    if (aValue == null) return order === 'asc' ? -1 : 1;
    if (bValue == null) return order === 'asc' ? 1 : -1;
    
    // Kiểm tra nếu là số
    const isNumeric = !isNaN(Number(aValue)) && !isNaN(Number(bValue));
    
    if (isNumeric) {
      return order === 'asc' 
        ? Number(aValue) - Number(bValue)
        : Number(bValue) - Number(aValue);
    }
    
    // Xử lý chuỗi
    const strA = String(aValue).toLowerCase();
    const strB = String(bValue).toLowerCase();
    
    return order === 'asc' 
      ? strA.localeCompare(strB)
      : strB.localeCompare(strA);
  });
};
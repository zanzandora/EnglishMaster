export const sortByField = <T>(
  data: T[],
  field: keyof T,
  order: 'asc' | 'desc' | null
): T[] => {
  if (!order) return data;

  return [...data].sort((a, b) => {
    const valueA = String(a[field]).toLowerCase();
    const valueB = String(b[field]).toLowerCase();

    return order === 'asc'
      ? valueA.localeCompare(valueB)
      : valueB.localeCompare(valueA);
  });
};
